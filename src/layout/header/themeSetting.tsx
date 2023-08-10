import { ref, defineComponent, defineAsyncComponent, watch } from 'vue'
import { defaultThemeForm } from '@/constant'
import { ThemeStore } from '@/store/modules/theme.ts'
const BaseForm = defineAsyncComponent(() => import('@/components/base/base-form.tsx'))

const { flattenObject, unFlattenObject } = window.App.$utils
export default defineComponent({
  name: 'SLAThemeSetting',
  props: {
    close: {
      type: Function,
      required: true
    }
  },
  setup() {
    window.App.$console.info('SLAThemeSetting 组件渲染')
    const themeStore = ThemeStore()
    const theme = ref<Record<string, any>>(flattenObject(themeStore.theme))
    watch(
      () => theme.value,
      value => {
        setTimeout(() => {
          const theme = unFlattenObject(value)
          themeStore.setTheme(theme)
          window.App.$console.info(`flattenObject:`, value)
          window.App.$console.info(`unFlattenObject:`, theme)
        }, 10)
      },
      { deep: true, immediate: true }
    )

    const resetLoading = ref<boolean>(false)
    const reset = () => {
      resetLoading.value = true
      setTimeout(() => {
        themeStore.resetTheme()
        theme.value = flattenObject(themeStore.getTheme())
        resetLoading.value = false
      }, 2000)
    }
    return { reset, resetLoading, theme }
  },
  render() {
    const {
      reset,
      resetLoading,
      $props: { close }
    } = this
    return (
      <>
        <div class="drawer__body">
          <el-form label-width={100} size="small">
            <BaseForm formOptions={defaultThemeForm} formData={this.theme} />
          </el-form>
        </div>
        <div class="drawer__footer">
          <el-button type="danger" loading={resetLoading} onClick={reset} plain>
            <span>恢复默认</span>
          </el-button>
          <el-button type="primary" onClick={close} plain>
            <span>保存</span>
          </el-button>
        </div>
      </>
    )
  }
})
