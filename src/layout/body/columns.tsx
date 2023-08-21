import { defineComponent, computed, defineAsyncComponent } from 'vue'
import { useStore } from '@/store'
const Aside = defineAsyncComponent(() => import('@/layout/component/aside.vue'))
const Header = defineAsyncComponent(() => import('@/layout/component/header.vue'))
const Main = defineAsyncComponent(() => import('@/layout/component/main.vue'))
// import ColumnsAside from '@/layout/component/columnsAside.vue';

export default defineComponent({
  setup() {
    const isFixedHeader = computed(() => useStore().useThemeStore.isFixedHeader)
    return { isFixedHeader }
  },
  render() {
    return (
      <>
        <el-container class="layout-container">
          {/*<ColumnsAside />*/}
          <div class="layout-columns-warp">
            <Aside />
            <el-container class={{ 'flex-center': true, 'layout-backtop': true, 'layout-backtop': !isFixedHeader }}>
              {isFixedHeader ? (
                <>
                  <Header />
                  <el-scrollbar class={{ 'layout-backtop': isFixedHeader }}>
                    <Main />
                  </el-scrollbar>
                </>
              ) : (
                <>
                  <el-scrollbar class={{ 'layout-backtop': isFixedHeader }}>
                    <Header />
                    <Main />
                  </el-scrollbar>
                </>
              )}
            </el-container>
          </div>
          <el-backtop target=".layout-backtop .el-scrollbar__wrap"></el-backtop>
        </el-container>
      </>
    )
  }
})
