import { ref, defineComponent, defineAsyncComponent } from 'vue'
import { CircleCloseFilled } from '@element-plus/icons-vue'

import themeConfig from '@/layout/header/theme.config.ts'

const BaseForm = defineAsyncComponent(() => import('@/components/base/base-form.tsx'))

export default defineComponent({
  name: 'SLAThemeSetting',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const close = (done: Function) => {
      emit('update:modelValue', false)
      typeof done === 'function' && done()
    }
    const showClose = ref<boolean>(false)
    const withHeader = ref<boolean>(false)
    return { close, showClose, withHeader }
  },
  render() {
    return (
      <el-drawer
        v-model={this.$props.modelValue}
        direction="rtl"
        size="30%"
        show-close={this.showClose}
        with-header={this.withHeader}
        before-close={this.close}
      >
        <BaseForm formData={themeConfig} />
        <el-button type="danger" onClick={this.close}>
          <el-icon class="el-icon--left">
            <CircleCloseFilled />
          </el-icon>
        </el-button>
      </el-drawer>
    )
  }
})