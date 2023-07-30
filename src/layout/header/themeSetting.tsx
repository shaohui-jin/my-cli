import { ref, defineComponent, defineAsyncComponent, watch } from 'vue'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { defaultThemeForm } from '@/constant'
import { ThemeStore } from '@/store/modules/theme.ts'
import { flattenObject, unFlattenObject } from '@/utils'
const BaseForm = defineAsyncComponent(() => import('@/components/base/base-form.tsx'))

export default defineComponent({
  name: 'SLAThemeSetting',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:visible'],
  setup(_, { emit }) {
    const close = (done: Function) => {
      emit('update:visible', false)
      typeof done === 'function' && done()
    }
    const showClose = ref<boolean>(false)
    const withHeader = ref<boolean>(false)
    const themeStore = ThemeStore()
    const theme = ref<Record<string, any>>(flattenObject(themeStore.getTheme()))
    watch(
      () => theme.value,
      value => {
        setTimeout(() => {
          const theme = unFlattenObject(value)
          themeStore.setTheme(theme)
          console.log('unFlattenObject', theme)
        }, 10)
      },
      { deep: true, immediate: true }
    )
    return { close, showClose, withHeader, theme }

    // flattenCollection
    // return { close, showClose, withHeader, theme }
  },
  render() {
    return (
      <>
        <el-drawer
          v-model={this.$props.visible}
          direction="rtl"
          size="30%"
          show-close={this.showClose}
          with-header={this.withHeader}
          before-close={this.close}
        >
          <BaseForm formOptions={defaultThemeForm} formData={this.theme} />
          <el-button type="danger" onClick={this.close}>
            <el-icon class="el-icon--left">
              <CircleCloseFilled />
            </el-icon>
          </el-button>
        </el-drawer>
      </>
    )
  }
})
