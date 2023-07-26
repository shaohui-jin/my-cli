import { ref, defineComponent, defineAsyncComponent } from 'vue'
import headerIcon from '@/assets/vue.svg'
import headerStyles from './header.module.less'
import { Setting } from '@element-plus/icons-vue'
export default defineComponent({
  name: 'SLAHeader',
  setup() {
    const visible = ref<boolean>(false)
    return { visible }
  },
  render() {
    let { visible } = this
    return (
      <>
        <div class={headerStyles.container}>
          <div class={headerStyles.container__left}>
            <el-image src={headerIcon} />
            <span>小石头潭记</span>
          </div>
          <div class={headerStyles.container__right}>
            {visible.toString()}
            <el-icon onClick={() => (this.visible = true)}>
              <Setting />
            </el-icon>
          </div>
        </div>
        <el-drawer
          v-model={this.visible}
          title="I have a nested table inside!"
          direction="rtl"
          size="30%"
        >
          12313
        </el-drawer>
      </>
    )
  }
})
