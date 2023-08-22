import { defineComponent, defineAsyncComponent, reactive, ref, toRefs, onBeforeMount, watch, computed } from 'vue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'

// const LayoutParentView = defineAsyncComponent(() => import('@/layout/component/header.vue'))
const Footer = defineAsyncComponent(() => import('@/layout/component/footer.tsx'))

export default defineComponent({
  setup() {
    const route = useRoute()
    const isFooter = computed(() => useStore().useThemeStore.isFooter)
    const state = reactive({
      headerHeight: '',
      currentRouteMeta: {}
    })

    // 页面加载前
    onBeforeMount(() => {
      // initHeaderHeight()
      initGetMeta()
    })
    // 初始化获取当前路由 meta，用于设置 iframes padding
    const initGetMeta = () => {
      state.currentRouteMeta = route.meta
    }

    const layoutScrollbarRef = ref()
    // 监听 themeConfig 配置文件的变化，更新菜单 el-scrollbar 的高度
    watch(
      () => useStore().useThemeStore,
      val => {
        state.headerHeight = val.isTagsview ? '84px' : '50px'
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
        state.currentRouteMeta = route.meta
      }
    )
    return {
      isFooter,
      ...toRefs(state)
    }
  },
  render() {
    const { isFooter, currentRouteMeta, headerHeight  } = this
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
            {/*<LayoutParentView />*/}
            {isFooter ? <Footer /> : <div></div>}
          </el-scrollbar>
        </el-main>
      </>
    )
  }
})
