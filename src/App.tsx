import { defineComponent, onBeforeMount } from 'vue'
import '@/assets/css/theme.less'
import { RouterView } from 'vue-router'
import { setExternalResources } from '@/utils/init'

export default defineComponent({
  setup() {
    onBeforeMount(() => {
      // 设置批量第三方 icon 图标
      setExternalResources.cssCdn()
      // 设置批量第三方 js
      setExternalResources.jsCdn()
    })
  },
  render() {
    return <RouterView />
  }
})
