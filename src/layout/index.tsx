import { RouterView } from 'vue-router'
import { defineAsyncComponent, defineComponent, ref, watchEffect } from 'vue'
import './layout.less'
import { ThemeStore } from '@/store/modules/theme'

const SLASidebar = defineAsyncComponent(() => import('@/layout/sidebar/index.tsx'))
const SLANavbar = defineAsyncComponent(() => import('@/layout/navbar/index.tsx'))
const SLAHeader = defineAsyncComponent(() => import('@/layout/header/index.tsx'))
const SLAFooter = defineAsyncComponent(() => import('@/layout/footer/index.tsx'))

export default defineComponent({
  name: 'SLALayout',
  setup() {
    const headerHeight = ref<number>(40)
    const navbarHeight = ref<number>(40)
    const footerHeight = ref<number>(40)
    const asideWidth = ref<number>(200)
    const isCollapse = ref<boolean>()
    const themeStore = ThemeStore()
    watchEffect(() => {
      headerHeight.value = Number(themeStore.theme.layout.headerHeight)
      navbarHeight.value = Number(themeStore.theme.layout.navbarHeight)
      footerHeight.value = Number(themeStore.theme.layout.footerHeight)
      asideWidth.value = Number(themeStore.theme.layout.asideWidth)
      isCollapse.value = themeStore.theme.sidebar.isCollapse
    })

    return { headerHeight, footerHeight, asideWidth, navbarHeight }
  },
  render() {
    const { headerHeight, footerHeight, asideWidth, navbarHeight } = this
    return (
      <>
        <el-container class="SLA-layout-container">
          <el-header class="header-container" height={`${headerHeight}px`}>
            <SLAHeader />
          </el-header>
          <el-container
            class="body-container"
            direction="horizontal"
            style={{ height: `calc(100% - ${headerHeight}px})` }}
          >
            <el-aside class="sidebar-container" style={{ width: 'auto' }}>
              <SLASidebar maxWidth={asideWidth} />
            </el-aside>
            <el-container class="content-container flex flex-d-c">
              <SLANavbar maxHeight={navbarHeight} />
              <el-main class="main-container">
                {/*<el-scrollbar>*/}
                <RouterView />
                {/*</el-scrollbar>*/}
              </el-main>
              <el-footer class="footer-container" height={`${footerHeight}px`}>
                <SLAFooter />
              </el-footer>
            </el-container>
          </el-container>
        </el-container>
      </>
    )
  }
})
