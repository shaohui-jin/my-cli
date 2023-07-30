import { ref, defineComponent, defineAsyncComponent } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import headerIcon from '@/assets/vue.svg'
import './header.less'

const ThemeSetting = defineAsyncComponent(() => import('@/layout/header/themeSetting.tsx'))
export default defineComponent({
  name: 'SLAHeader',
  setup() {
    const visible = ref<boolean>(true)
    return { visible }
  },
  render() {
    return (
      <>
        <div class="header-container">
          <div class="container__left">
            <el-image src={headerIcon} />
            <el-image src="/vite.svg" />
            <span>小石头潭记</span>
          </div>
          <div class="container__right">
            <el-icon onClick={() => (this.visible = true)}>
              <Setting />
            </el-icon>
          </div>
        </div>
        <ThemeSetting visible={this.visible} />
      </>
    )
  }
})
