import { defineAsyncComponent, defineComponent } from 'vue'
import '@/assets/css/theme.less'

const Layout = defineAsyncComponent(() => import('@/layout'))

export default defineComponent({
  setup() {
    return () => <Layout />
  }
})
