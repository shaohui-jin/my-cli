import {
  computed,
  Transition,
  KeepAlive,
  defineComponent,
  ref,
  getCurrentInstance,
  onBeforeMount,
  onUnmounted,
  nextTick,
  watch
} from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import { RouterView } from 'vue-router'

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any
    const route = useRoute()
    const refreshRouterViewKey = ref<string>('')
    const keepAliveNameList = ref<string[]>([])
    const keepAliveNameNewList = ref([])

    // 设置主界面切换动画
    const transitionName = computed(() => useStore().useThemeStore.animation)

    // 页面加载前，处理缓存，页面刷新时路由缓存处理
    onBeforeMount(() => {
      const names = useStore().useKeepAliveStore.keepAliveNames
      keepAliveNameList.value = names
      proxy.mittBus.on('onTagViewRefreshRouterView', (fullPath: string) => {
        keepAliveNameList.value = names.filter((name: string) => route.name !== name)
        refreshRouterViewKey.value = ''
        nextTick(() => {
          refreshRouterViewKey.value = fullPath
          keepAliveNameList.value = names
        })
      })
    })
    // 页面卸载时
    onUnmounted(() => {
      proxy.mittBus.off('onTagViewRefreshRouterView')
    })
    // 监听路由变化，防止 tagsView 多标签时，切换动画消失
    watch(
      () => route.fullPath,
      () => {
        refreshRouterViewKey.value = route.fullPath
      }
    )
    return {
      keepAliveNameNewList,
      keepAliveNameList,
      refreshRouterViewKey,
      transitionName
    }
  },
  render() {
    const { transitionName, keepAliveNameList, refreshRouterViewKey } = this
    return (
      <>
        <div class="h100">
          <RouterView
            v-slots={{
              default: ({ Component: RouteComponent }: { Component: any }) => {
                return (
                  <>
                    <Transition name={transitionName} mode="out-in">
                      <KeepAlive include={keepAliveNameList}>
                        <RouteComponent key={refreshRouterViewKey} class="w100" />
                      </KeepAlive>
                    </Transition>
                  </>
                )
              }
            }}
          />
        </div>
      </>
    )
  }
})
