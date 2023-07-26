import { RouterView } from 'vue-router'
import { defineAsyncComponent, defineComponent, ref } from 'vue'
import styles from './layout.module.less'

const Sidebar = defineAsyncComponent(() => import('@/layout/sidebar/index.tsx'))
const Header = defineAsyncComponent(() => import('@/layout/header/index.tsx'))
const Footer = defineAsyncComponent(() => import('@/layout/footer/index.tsx'))

export default defineComponent({
  setup() {
    const headerHeight = ref<string>('40px')
    const footerHeight = ref<string>('40px')
    const asideWidth = ref<string>('250px')
    return { headerHeight, footerHeight, asideWidth }
  },
  render() {
    return (
      <>
        <el-container className={styles.layout}>
          <el-header class={styles.header} height={this.headerHeight}>
            <Header />
          </el-header>
          <el-container
            direction="horizontal"
            style={{ height: `calc(100% - ${this.headerHeight})` }}
          >
            <el-aside class={styles.aside} width={this.asideWidth}>
              <Sidebar />
            </el-aside>
            <el-container style={{ height: '100%' }}>
              <el-main class={styles.main}>
                {/*<el-scrollbar>*/}
                <RouterView />
                {/*</el-scrollbar>*/}
              </el-main>
              <el-footer class={styles.footer} height={this.footerHeight}>
                <Footer />
              </el-footer>
            </el-container>
          </el-container>
        </el-container>
      </>
    )
  }
})
