import {
  computed,
  defineComponent,
  reactive,
  getCurrentInstance,
  watch,
  ref,
  toRefs,
  onBeforeMount,
  defineAsyncComponent
} from 'vue'
import { useStore } from '@/store'

const Vertical = defineAsyncComponent(() => import('@/layout/navMenu/vertical.tsx'))
const Logo = defineAsyncComponent(() => import('@/layout/component/logo.tsx'))

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any
    const state: any = reactive({
      menuList: [],
      clientWidth: ''
    })

    // 获取卡片全屏信息
    const tagViewCurrenFull = computed(() => useStore().useRouteStore.tagViewCurrenFull)
    // 设置菜单展开/收起时的宽度
    const setCollapseStyle = computed(() => {
      const { layout, isCollapse, menuBar } = useStore().useThemeStore
      const asideBrColor = ['#FFFFFF', '#FFF', '#fff', '#ffffff'].includes(menuBar) ? 'layout-el-aside-br-color' : ''
      // 判断是否是手机端
      if (state.clientWidth <= 1000) {
        if (isCollapse) {
          document.body.setAttribute('class', 'el-popup-parent--hidden')
          const asideEle = document.querySelector('.layout-container') as HTMLElement
          const modeDivs = document.createElement('div')
          modeDivs.setAttribute('class', 'layout-aside-mobile-mode')
          asideEle.appendChild(modeDivs)
          modeDivs.addEventListener('click', closeLayoutAsideMobileMode)
          return [asideBrColor, 'layout-aside-mobile', 'layout-aside-mobile-open']
        } else {
          // 关闭弹窗
          closeLayoutAsideMobileMode()
          return [asideBrColor, 'layout-aside-mobile', 'layout-aside-mobile-close']
        }
      } else {
        if (layout === 'columns') {
          // 分栏布局，菜单收起时宽度给 1px
          if (isCollapse) {
            return [asideBrColor, 'layout-aside-pc-1']
          } else {
            return [asideBrColor, 'layout-aside-pc-220']
          }
        } else {
          // 其它布局给 64px
          if (isCollapse) {
            return [asideBrColor, 'layout-aside-pc-64']
          } else {
            return [asideBrColor, 'layout-aside-pc-220']
          }
        }
      }
    })
    // 关闭移动端蒙版
    const closeLayoutAsideMobileMode = () => {
      const el = document.querySelector('.layout-aside-mobile-mode')
      el && el.parentNode?.removeChild(el)
      const clientWidth = document.body.clientWidth
      if (clientWidth < 1000) useStore().useThemeStore.isCollapse = false
      document.body.setAttribute('class', '')
    }
    // 设置显示/隐藏 logo
    const setShowLogo = computed(() => {
      const { layout, isShowLogo } = useStore().useThemeStore
      return (isShowLogo && layout === 'default') || (isShowLogo && layout === 'columns')
    })
    // 设置/过滤路由（非静态路由/是否显示在菜单中）
    const setFilterRoutes = () => {
      if (useStore().useThemeStore.layout === 'columns') return false
      state.menuList = filterRoutesFun(useStore().useRouteStore.routesList)
    }
    // 路由过滤递归函数
    const filterRoutesFun = (arr: Array<object>) => {
      return arr
        .filter((item: any) => !item.meta.isHide)
        .map((item: any) => {
          item = Object.assign({}, item)
          if (item.children) item.children = filterRoutesFun(item.children)
          return item
        })
    }
    // 设置菜单导航是否固定（移动端）
    const initMenuFixed = (clientWidth: number) => {
      state.clientWidth = clientWidth
    }
    // 鼠标移入、移出
    const onAsideEnterLeave = (bool: boolean) => {
      const { layout } = useStore().useThemeStore
      if (layout !== 'columns') return false
      if (!bool) proxy.mittBus.emit('restoreDefault')
      useStore().useRouteStore.isColumnsMenuHover = bool
    }
    // 监听 themeConfig 配置文件的变化，更新菜单 el-scrollbar 的高度
    const layoutAsideScrollbarRef = ref()
    watch(useStore().useThemeStore, val => {
      if (val.isShowLogoChange !== val.isShowLogo) {
        if (layoutAsideScrollbarRef.value) {
          layoutAsideScrollbarRef.value.update()
        }
      }
    })
    // 监听vuex值的变化，动态赋值给菜单中
    watch(useStore().useThemeStore, val => {
      const { layout, isClassicSplitMenu } = val
      if (layout === 'classic' && isClassicSplitMenu) return false
      setFilterRoutes()
    })
    // 页面加载前
    onBeforeMount(() => {
      initMenuFixed(document.body.clientWidth)
      setFilterRoutes()
      // 此界面不需要取消监听(proxy.mittBus.off('setSendColumnsChildren))
      // 因为切换布局时有的监听需要使用，取消了监听，某些操作将不生效
      proxy.mittBus.on('setSendColumnsChildren', (res: any) => {
        state.menuList = res.children
      })
      proxy.mittBus.on('setSendClassicChildren', (res: any) => {
        const { layout, isClassicSplitMenu } = useStore().useThemeStore
        if (layout === 'classic' && isClassicSplitMenu) {
          state.menuList = []
          state.menuList = res.children
        }
      })
      proxy.mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
        setFilterRoutes()
      })
      proxy.mittBus.on('layoutMobileResize', (res: any) => {
        initMenuFixed(res.clientWidth)
        closeLayoutAsideMobileMode()
      })
    })
    return {
      setCollapseStyle,
      setShowLogo,
      tagViewCurrenFull,
      onAsideEnterLeave,
      ...toRefs(state)
    }
  },
  render() {
    const { tagViewCurrenFull, setCollapseStyle, setShowLogo, menuList, onAsideEnterLeave } = this
    return (
      <>
        {tagViewCurrenFull ? (
          <>
            <div class="h100">
              <el-aside class={['layout-aside', ...setCollapseStyle]}>
                {setShowLogo ? <Logo /> : <div></div>}
                <el-scrollbar
                  class="flex-auto"
                  ref="layoutAsideScrollbarRef"
                  onMouseenter={onAsideEnterLeave(true)}
                  onMouseleave={onAsideEnterLeave(false)}
                >
                  <Vertical menuList={menuList} />
                </el-scrollbar>
              </el-aside>
            </div>
          </>
        ) : (
          <div></div>
        )}
      </>
    )
  }
})
