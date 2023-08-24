import { defineComponent, computed, watch, defineAsyncComponent, ref } from 'vue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'

const Aside = defineAsyncComponent(() => import('@/layout/component/aside.tsx'))
const Header = defineAsyncComponent(() => import('@/layout/component/header.tsx'))
const Main = defineAsyncComponent(() => import('@/layout/component/main.tsx'))

export default defineComponent({
  setup() {
    // const { proxy } = getCurrentInstance() as any
    const layoutDefaultsScrollbarRef = ref()
    const route = useRoute()
    const isFixedHeader = computed(() => {
      return useStore().useThemeStore.isFixedHeader
    })
    // 监听路由的变化
    watch(
      () => route.path,
      () => {
        // proxy.$refs.layoutDefaultsScrollbarRef.wrap$.scrollTop = 0
        layoutDefaultsScrollbarRef.value.scrollTop = 0
      }
    )
    return {
      isFixedHeader
    }
  },
  render() {
    const { isFixedHeader } = this
    return (
      <>
        <el-container class="layout-container">
          <Aside />
          <el-container class={{ 'flex-center': true, 'layout-backtop': !isFixedHeader }}>
            {isFixedHeader ? (
              <>
                <Header />
                <el-scrollbar ref="layoutDefaultsScrollbarRef" class={{ 'layout-backtop': isFixedHeader }}>
                  <Main />
                </el-scrollbar>
              </>
            ) : (
              <>
                <el-scrollbar ref="layoutDefaultsScrollbarRef" class={{ 'layout-backtop': isFixedHeader }}>
                  <Header />
                  <Main />
                </el-scrollbar>
              </>
            )}
          </el-container>
          <el-backtop target=".layout-backtop .el-scrollbar__wrap"></el-backtop>
        </el-container>
      </>
    )
  }
})
