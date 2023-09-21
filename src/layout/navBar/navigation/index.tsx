import { useStore } from '@/store'
import { ref, computed, defineComponent, defineAsyncComponent, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

// import Breadcrumb from './breadcrumb.vue'
// import User from './user.vue'
// import Horizontal from './horizontal.vue'

const Logo = defineAsyncComponent(() => import('@/layout/logo'))
const Breadcrumb = defineAsyncComponent(() => import('@/layout/navBar/navigation/breadcrumb.tsx'))
const User = defineAsyncComponent(() => import('@/layout/navBar/navigation/user.tsx'))

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any
    const route = useRoute()
    const menuList = ref<any[]>([])
    // 获取布局配置信息
    const themeConfig = computed(() => useStore().useThemeStore)
    // 设置 logo 显示/隐藏
    const showLogo = computed(() => {
      const { isShowLogo, layout } = useStore().useThemeStore
      return (isShowLogo && layout === 'classic') || (isShowLogo && layout === 'transverse')
    })
    // 设置是否显示横向导航菜单
    const isLayoutTransverse = computed(() => {
      const { layout, isClassicSplitMenu } = useStore().useThemeStore
      return layout === 'transverse' || (isClassicSplitMenu && layout === 'classic')
    })
    // 设置/过滤路由（非静态路由/是否显示在菜单中）
    const setFilterRoutes = () => {
      const { layout, isClassicSplitMenu } = useStore().useThemeStore
      if (layout === 'classic' && isClassicSplitMenu) {
        menuList.value = delClassicChildren(filterRoutesFun(useStore().useRouteStore.routesList))
        const resData = setSendClassicChildren(route.path)
        proxy.mittBus.emit('setSendClassicChildren', resData)
      } else {
        menuList.value = filterRoutesFun(useStore().useRouteStore.routesList)
      }
    }
    // 设置了分割菜单时，删除底下 children
    const delClassicChildren = (arr: Array<object>) => {
      arr.map((v: any) => {
        if (v.children) delete v.children
      })
      return arr
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
    // 传送当前子级数据到菜单中
    const setSendClassicChildren = (path: string) => {
      const currentPathSplit = path.split('/')
      const currentData: any = {}
      filterRoutesFun(useStore().useRouteStore.routesList).map((v, k) => {
        if (v.path === `/${currentPathSplit[1]}`) {
          v['k'] = k
          currentData['item'] = [{ ...v }]
          currentData['children'] = [{ ...v }]
          if (v.children) currentData['children'] = v.children
        }
      })
      return currentData
    }
    // 页面加载时
    onMounted(() => {
      setFilterRoutes()
      proxy.mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
        setFilterRoutes()
      })
    })
    // 页面卸载时
    onUnmounted(() => {
      proxy.mittBus.off('getBreadcrumbIndexSetFilterRoutes')
    })
    return { showLogo, isLayoutTransverse, menuList }
  },
  render() {
    const { showLogo, isLayoutTransverse, menuList } = this
    return (
      <div class="layout-navbars-breadcrumb-index">
        {showLogo && <Logo />}
        <Breadcrumb />
        {/*{isLayoutTransverse && <Horizontal menuList={this.menuList} />}*/}
        <User />
      </div>
    )
  }
})
