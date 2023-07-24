import { RouterView } from 'vue-router'
import { defineAsyncComponent, defineComponent } from 'vue'
import type { DefineComponent } from 'vue'

const Menu: DefineComponent = defineAsyncComponent(() => import('@/layout/sidebar/menu.tsx'))
export default defineComponent({
  render() {
    return (
      <>
        <el-container direction="horizontal" style={{ height: '100vh' }}>
          <el-aside width="250px">
            <el-scrollbar>
              <Menu />
            </el-scrollbar>
          </el-aside>
          <el-container>
            <el-header>Header</el-header>
            <el-main>
              <el-scrollbar>
                <RouterView />
              </el-scrollbar>
            </el-main>
            <el-footer height="40px">@1997-2023 网站建设：JSH</el-footer>
          </el-container>
        </el-container>
      </>
    )
  }
})
