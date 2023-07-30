import { ref, defineComponent, defineAsyncComponent, computed } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import headerIcon from '@/assets/vue.svg'
import './header.less'
import { ThemeStore } from '@/store/modules/theme.ts'

const SLAThemeSetting = defineAsyncComponent(() => import('@/layout/header/themeSetting.tsx'))
export default defineComponent({
  name: 'SLAHeader',
  setup() {
    const visible = ref<boolean>(true)
    const themeSore = ThemeStore()
    const title = computed(() => themeSore.getTheme().header.title)
    return { visible, title }
  },
  render() {
    return (
      <>
        <div class="header-container">
          <div class="container__left">
            <el-image src={headerIcon} />
            <el-image src="/vite.svg" />
            <span>
              {this.title} {this.visible.toString()}
            </span>
          </div>
          <div class="container__right">
            <el-icon onClick={() => (this.visible = true)}>
              <Setting />
            </el-icon>
          </div>
        </div>
        <SLAThemeSetting visible={this.visible} />
      </>
    )
  }
})
