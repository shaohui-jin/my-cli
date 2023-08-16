import { ref, defineComponent, defineAsyncComponent, computed } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import headerIcon from '@/assets/vue.svg'
import './header.less'
import { ThemeStore } from '@/store/modules/theme'

const SLAThemeSetting = defineAsyncComponent(() => import('@/layout/header/themeSetting.tsx'))
export default defineComponent({
  name: 'SLAHeader',
  setup() {
    const visible = ref<boolean>(false)
    const themeSore = ThemeStore()
    const title = computed(() => themeSore.getThemeConfig().header.title)
    return { visible, title }
  },
  render() {
    return (
      <>
        <div class="SLA-header-container">
          <div class="container__left">
            <el-image src={headerIcon} />
            <el-image src={import.meta.env.VITE_APP_BASE_PATH + 'vite.svg'} />
            <span>{this.title}</span>
          </div>
          <div class="container__right">
            <el-icon onClick={() => (this.visible = true)}>
              <Setting />
            </el-icon>
          </div>
        </div>
        <el-drawer
          v-model={this.visible}
          direction="rtl"
          size="30%"
          show-close={false}
          with-header={false}
          before-close={(done: () => void) => {
            this.visible = false
            done()
          }}
        >
          <SLAThemeSetting close={() => (this.visible = false)} />
        </el-drawer>
      </>
    )
  }
})
