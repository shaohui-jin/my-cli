import { RouterView } from 'vue-router'
import { defineAsyncComponent, defineComponent, ref } from 'vue'
import './layout.less'

const SLASidebar = defineAsyncComponent(() => import('@/layout/sidebar/index.tsx'))
const SLANavbar = defineAsyncComponent(() => import('@/layout/navbar/index.tsx'))
const SLAHeader = defineAsyncComponent(() => import('@/layout/header/index.tsx'))
const SLAFooter = defineAsyncComponent(() => import('@/layout/footer/index.tsx'))

export default defineComponent({
  name: 'SLALayout',
  setup() {
    const headerHeight = ref<string>('50px')
    const navbarHeight = ref<string>('30px')
    const footerHeight = ref<string>('40px')
    const asideWidth = ref<string>('250px')
    return { headerHeight, footerHeight, asideWidth, navbarHeight }
  },
  render() {
    const { headerHeight, footerHeight, asideWidth, navbarHeight } = this
    return (
      <>
        <el-container class="SLA-layout-container">
          <el-header class="header-container" height={headerHeight}>
            <SLAHeader />
          </el-header>
          <el-container
            class="body-container"
            direction="horizontal"
            style={{ height: `calc(100% - ${headerHeight}})` }}
          >
            <el-aside class="sidebar-container" width={asideWidth}>
              <SLASidebar />
            </el-aside>
            <el-container style={{ height: '100%' }}>
              <el-header class="navbar-container" height={navbarHeight}>
                <SLANavbar />
              </el-header>
              <el-main class="main-container">
                {/*<el-scrollbar>*/}
                <RouterView />
                {/*</el-scrollbar>*/}
              </el-main>
              <el-footer class="footer-container" height={this.footerHeight}>
                <SLAFooter />
              </el-footer>
            </el-container>
          </el-container>
        </el-container>
      </>
    )
  }
})
