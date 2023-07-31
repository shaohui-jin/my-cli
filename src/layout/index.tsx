import { RouterView } from 'vue-router'
import { defineAsyncComponent, defineComponent, ref } from 'vue'
import styles from './layout.module.less'

const SLASidebar = defineAsyncComponent(() => import('@/layout/sidebar/index.tsx'))
const SLANavbar = defineAsyncComponent(() => import('@/layout/navbar/index.tsx'))
const SLAHeader = defineAsyncComponent(() => import('@/layout/header/index.tsx'))
const SLAFooter = defineAsyncComponent(() => import('@/layout/footer/index.tsx'))

export default defineComponent({
  setup() {
    const headerHeight = ref<string>('50px')
    const navbarHeight = ref<string>('20px')
    const footerHeight = ref<string>('40px')
    const asideWidth = ref<string>('250px')
    return { headerHeight, footerHeight, asideWidth, navbarHeight }
  },
  render() {
    return (
      <>
        <el-container className={styles.layout}>
          <el-header class={styles.header} height={this.headerHeight}>
            <SLAHeader />
          </el-header>
          <el-container
            direction="horizontal"
            style={{ height: `calc(100% - ${this.headerHeight}})` }}
          >
            <el-aside class={styles.aside} width={this.asideWidth}>
              <SLASidebar />
            </el-aside>
            <el-container style={{ height: '100%' }}>
              <el-header height={this.navbarHeight}>
                <SLANavbar />
              </el-header>
              <el-main class={styles.main}>
                {/*<el-scrollbar>*/}
                <RouterView />
                {/*</el-scrollbar>*/}
              </el-main>
              <el-footer class={styles.footer} height={this.footerHeight}>
                <SLAFooter />
              </el-footer>
            </el-container>
          </el-container>
        </el-container>
      </>
    )
  }
})
