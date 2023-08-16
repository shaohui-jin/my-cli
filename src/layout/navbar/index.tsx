import { computed, defineComponent, watchEffect, ref, ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/constant'
import './navbar.less'
import { Fold, Expand } from '@element-plus/icons-vue'
import { Route } from '@/types'
import { ThemeStore } from '@/store/modules/theme'
import { flattenArray } from '@/utils/common'

export default defineComponent({
  name: 'SLANavbar',
  props: {
    maxHeight: {
      type: Number,
      required: true
    }
  },
  setup() {
    const basePath: string = '/home'
    const route = useRoute()
    const router = useRouter()

    const current = ref<string>(basePath)
    const back = ref<string>(basePath)
    watchEffect(() => {
      current.value = route.path
      back.value = (router.options.history?.state?.back || basePath) as string
    })

    // 是否收缩侧边栏
    const themeStore = ThemeStore()
    const isCollapse = ref<boolean>(false)
    watchEffect(() => {
      isCollapse.value = themeStore.theme.sidebar.isCollapse
    })
    const handleCollapse = () => {
      themeStore.setThemeConfig({
        ...themeStore.getThemeConfig(),
        ...{ sidebar: { isCollapse: !isCollapse.value } }
      })
    }

    // 计算当前路由、上一页路由
    const routesMap = ref<{ [path: string]: Route }>({})
    ;(flattenArray(routes, 'children') as Route[]).forEach((route: Route) => {
      routesMap.value[route.path] = route
    })
    const currentRoute: ComputedRef<Route> = computed((): Route => routesMap.value[current.value])
    const backRoute: ComputedRef<Route> = computed((): Route => routesMap.value[back.value])
    const showBack: ComputedRef<boolean> = computed(() => {
      return current.value !== back.value || back.value !== basePath
    })

    /**
     * 获取切换侧边栏收缩状态图标
     */
    const getCollapseIcon = () => {
      return isCollapse.value ? (
        <el-icon class="pointer" onClick={handleCollapse}>
          <Expand />
        </el-icon>
      ) : (
        <el-icon class="pointer" onClick={handleCollapse}>
          <Fold />
        </el-icon>
      )
    }

    /**
     * 获取回退的tag
     */
    const getBackTag = () => {
      return showBack.value ? (
        <>
          <el-tag class="pointer" onClick={toBack}>
            {backRoute.value.name}
          </el-tag>
        </>
      ) : (
        <div></div>
      )
    }
    const toBack = () => router.back()
    return { currentRoute, backRoute, showBack, toBack, getCollapseIcon, getBackTag }
  },
  render() {
    const { currentRoute, getCollapseIcon, getBackTag } = this
    return (
      <>
        <div class="SLA-navbar-container flex flex-jc-sb" style={{ height: `${this.$props.maxHeight}px` }}>
          <div class="navbar-container__left flex-align-center">
            {getCollapseIcon()}
            <el-tag class="m-l-10">{currentRoute.name}</el-tag>
          </div>
          <div class="navbar-container__right flex-align-center">{getBackTag()}</div>
        </div>
      </>
    )
  }
})
