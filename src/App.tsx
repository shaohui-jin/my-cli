import { defineAsyncComponent, defineComponent } from 'vue'
import '@/assets/css/theme.css'

const Layout = defineAsyncComponent(() => import('@/layout'))

export default defineComponent({
  setup() {
    return () => <Layout />
  }
})
