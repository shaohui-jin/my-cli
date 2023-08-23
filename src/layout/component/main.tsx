import { defineComponent, defineAsyncComponent, ref, onBeforeMount, watch, computed } from 'vue'
import { useStore } from '@/store'
import { RouteMeta, useRoute } from 'vue-router'

const View = defineAsyncComponent(() => import('@/layout/routerView/view.tsx'))
const Footer = defineAsyncComponent(() => import('@/layout/component/footer.tsx'))

export default defineComponent({
  setup() {
    const route = useRoute()
    const isFooter = computed(() => useStore().useThemeStore.isFooter)

    const headerHeight = ref<string>('')
    const currentRouteMeta = ref<RouteMeta>({})

    // 页面加载前
    onBeforeMount(() => {
      // initHeaderHeight()
      initGetMeta()
    })
    // 初始化获取当前路由 meta，用于设置 iframes padding
    const initGetMeta = () => {
      currentRouteMeta.value = route.meta
    }

    const layoutScrollbarRef = ref()
    // 监听 themeConfig 配置文件的变化，更新菜单 el-scrollbar 的高度
    watch(
      () => useStore().useThemeStore,
      val => {
        headerHeight.value = val.isTagView ? '84px' : '50px'
        if (val.isFixedHeaderChange !== val.isFixedHeader) {
          if (!layoutScrollbarRef.value) {
            return false
          } else {
            layoutScrollbarRef.value.update()
          }
        }
      },
      {
        deep: true,
        immediate: true
      }
    )
    // 监听路由变化
    watch(
      () => route.path,
      () => {
        currentRouteMeta.value = route.meta
      }
    )
    return { isFooter, headerHeight, currentRouteMeta }
  },
  render() {
    const { isFooter, currentRouteMeta, headerHeight } = this
    return (
      <>
        <el-main class="layout-main">
          <el-scrollbar
            class="layout-scrollbar"
            ref="layoutScrollbarRef"
            style={{
              minHeight: `calc(100vh - ${headerHeight})`,
              padding: currentRouteMeta.isLink && currentRouteMeta.isIframe ? 0 : '',
              transition: 'padding 0.3s ease-in-out'
            }}
          >
            <View />
            {isFooter ? <Footer /> : <div></div>}
          </el-scrollbar>
        </el-main>
      </>
    )
  }
})
