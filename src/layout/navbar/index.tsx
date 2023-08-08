import { computed, defineComponent, watchEffect, ref, ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/constant'
import './navbar.less'
import { Back } from '@element-plus/icons-vue'
import { Route } from '@/types'
import Utils from '@/utils/utils'

export default defineComponent({
  name: 'SLANavbar',
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

    const routesMap = ref<{ [path: string]: Route }>({})
    Utils.flattenArray(routes, 'children').forEach(route => {
      routesMap.value[route.path] = route
    })

    const currentRoute: ComputedRef<Route> = computed((): Route => routesMap.value[current.value])
    const backRoute: ComputedRef<Route> = computed((): Route => routesMap.value[back.value])

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
            <div></div>
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
