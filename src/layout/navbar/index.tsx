import { computed, ComputedRef, defineComponent, watch, watchEffect, ref } from 'vue'
import { routes } from '@/constant'
import './navbar.less'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import { Back } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'SLANavbar',
  setup() {
    const basePath: string = '/home'
    const route = useRoute()
    const router = useRouter()

    const current = ref<string>()
    // const current = ref<string>(route.path)
    // const back = ref<string>(router.options.history.state.back || basePath)
    const back = ref<string>()
    watchEffect(() => {
      current.value = route.path
      back.value = router.options.history.state.back || basePath
    })
    // watchEffect(() => {
    //   const route = this.$route
    //   console.log(12312312, route)
    //   current.value = route.path
    //   back.value = this.$router.options.history.state.back || '/home'
    // })
    // watch(
    //   () => route.path,
    //   (path, _path) => {
    //     console.log(12312312, path, _path)
    //     current.value = path
    //     back.value = router.options.history.state.back || '/home'
    //   },
    //   { deep: true }
    // )

    const routesMap = ref<{ [path: string]: RouteRecordRaw }>({})
    routes.forEach(route => {
      routesMap.value[route.path] = route
    })

    const currentRoute: RouteRecordRaw = computed(
      () =>
        // routes.find(route => route.path === current.value)
        routesMap.value[current.value]
    )
    const backRoute: RouteRecordRaw = computed(
      () =>
        // routes.find(route => route.path === back.value)
        routesMap.value[back.value]
    )

    const showBack = computed(() => {
      return current.value !== back.value || back.value !== basePath
    })
    const toBack = () => router.back()
    return {
      currentRoute,
      backRoute,
      showBack,
      toBack
    }
  },
  render() {
    const { toBack, showBack, currentRoute, backRoute } = this
    return (
      <>
        <div class="SLA-navbar-container">
          {showBack ? (
            <>
              <div class="navbar-container__back_route">
                <el-icon class="pointer" onClick={toBack}>
                  <Back />
                </el-icon>
                <span class="back-route__name pointer" onClick={toBack}>
                  {backRoute.name}
                </span>
                <span class="back-route__separator"></span>
              </div>
            </>
          ) : (
            <></>
          )}
          <div class="navbar-container__current_route">
            {/*<span class="">{backRoute.name} </span>*/}
            {/*<span class="">{currentRoute.name}</span>*/}
            <el-tag>{currentRoute.name}</el-tag>
          </div>
        </div>
      </>
    )
  }
})
