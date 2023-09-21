import { ref, computed, getCurrentInstance, onMounted, defineComponent, TransitionGroup, Transition } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { Expand, Fold } from '@element-plus/icons-vue'
import { flattenArray } from '@/utils/common.ts'
import { RouteRecordRaw } from '@/router/utils.ts'

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any
    const route = useRoute()
    const router = useRouter()
    const breadcrumbList = ref<Array<any>>([])
    const routeSplit = ref<Array<any>>([])

    const getThemeConfig = computed(() => useStore().useThemeStore)

    /**
     * @desc 动态设置经典、横向布局不显示
     */
    const isShowBreadcrumb = computed(() => {
      // initRouteSplit(route.path)
      const { layout, isBreadcrumb } = useStore().useThemeStore
      if (layout === 'classic' || layout === 'transverse') {
        return 'none'
      } else {
        return isBreadcrumb ? '' : 'none'
      }
    })

    /**
     * @desc 面包屑点击时
     * @param redirect
     * @param path
     * @param event
     */
    const onBreadcrumbClick = ({ redirect, path }: any, event: any) => {
      event.preventDefault()
      redirect ? router.push(redirect) : router.push(path)
    }
    /**
     * @desc 展开/收起左侧菜单点击
     */
    const onThemeConfigChange = () => {
      proxy.mittBus.emit('onMenuClick')
      useStore().useThemeStore.isCollapse = !useStore().useThemeStore.isCollapse
    }
    /**
     * @desc 处理面包屑数据
     * @param arr
     */
    const getBreadcrumbList = (arr: RouteRecordRaw[]) => {
      const result = [arr[0]]
      let route = ``
      routeSplit.value.forEach(e => {
        route += `/${e}`
        result.push(flattenArray(arr).find(e => e.path === route))
      })
      breadcrumbList.value = result
    }
    /**
     * @desc 当前路由字符串切割成数组，并删除第一项空内容
     * @param path 路径地址
     * @methods getBreadcrumbList 处理面包屑数据
     * @example
     * initRouteSplit('/demo/define')
     * breadcrumbList => 缓存的路由 (先拿到首页)
     * routeSplit => ['demo', 'define']
     */
    const initRouteSplit = (path: string) => {
      if (!useStore().useThemeStore.isBreadcrumb) return false
      routeSplit.value = path.split('/').filter(e => e !== '')
      getBreadcrumbList(useStore().useRouteStore.getRoutesList())
    }
    // 页面加载时
    onMounted(() => {
      initRouteSplit(route.path)
    })
    // 路由更新时
    onBeforeRouteUpdate(to => {
      initRouteSplit(to.path)
    })
    return { onThemeConfigChange, isShowBreadcrumb, getThemeConfig, onBreadcrumbClick, breadcrumbList }
  },
  render() {
    const { onThemeConfigChange, isShowBreadcrumb, getThemeConfig, onBreadcrumbClick, breadcrumbList } = this
    return (
      <>
        <div class="layout-navbar-breadcrumb" style={{ display: isShowBreadcrumb }}>
          <el-icon class="layout-navbar-breadcrumb-icon" onClick={onThemeConfigChange}>
            {getThemeConfig.isCollapse ? <Expand /> : <Fold />}
          </el-icon>
          <el-breadcrumb class="layout-navbar-breadcrumb-hide">
            <TransitionGroup name="breadcrumb">
              {breadcrumbList.map((v, k) => {
                return (
                  <>
                    <Transition name={`breadcrumb${k}`} key={k} mode="out-in">
                      <el-breadcrumb-item>
                        {k === breadcrumbList.length - 1 ? (
                          <>
                            <span class="layout-navbar-breadcrumb-span">
                              {getThemeConfig.isBreadcrumbIcon && (
                                <i class={['layout-navbar-breadcrumb-iconfont', `${v.meta.icon}`]}></i>
                              )}
                              {v.meta.title}
                            </span>
                          </>
                        ) : (
                          <>
                            <a onClick={event => onBreadcrumbClick(v, event)}>
                              {getThemeConfig.isBreadcrumbIcon && (
                                <i class={['layout-navbar-breadcrumb-iconfont', `${v.meta.icon}`]}></i>
                              )}
                              {v.meta.title}
                            </a>
                          </>
                        )}
                      </el-breadcrumb-item>
                    </Transition>
                  </>
                )
              })}
            </TransitionGroup>
          </el-breadcrumb>
        </div>
      </>
    )
  }
})
