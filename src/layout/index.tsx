import { RouterView } from 'vue-router'
import { defineAsyncComponent, defineComponent } from 'vue'

const SidebarMenu = defineAsyncComponent(() => import('@/layout/sidebar/index.tsx'))

// import SidebarMenu from '@/layout/sidebar/index.tsx'
export default defineComponent({
  components: {
    SidebarMenu
  },
  render() {
    return (
      <>
        <el-container direction="horizontal" style={{ height: '100vh' }}>
          <el-aside width="250px">
            <el-scrollbar>
              <SidebarMenu />
            </el-scrollbar>
          </el-aside>
          <el-container>
            <el-header>Header</el-header>
            <el-main>
              {/*<el-scrollbar>*/}
              <RouterView />
              {/*</el-scrollbar>*/}
            </el-main>
            <el-footer height="40px">@1997-2023 网站建设：JSH</el-footer>
          </el-container>
        </el-container>
      </>
    )
  }
})
