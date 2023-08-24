import { defineAsyncComponent, defineComponent } from 'vue'
import { useStore } from '@/store'

const DefaultLayout = defineAsyncComponent(() => import('@/layout/body/default.tsx'))
const ClassicLayout = defineAsyncComponent(() => import('@/layout/body/classic.tsx'))
const TransverseLayout = defineAsyncComponent(() => import('@/layout/body/transverse.tsx'))
const ColumnsLayout = defineAsyncComponent(() => import('@/layout/body/columns.tsx'))

export default defineComponent({
  name: 'SLALayout',
  setup() {
    const layout = useStore().useThemeStore.layout
    const getLayout = () => {
      switch (layout) {
        case 'default':
          return <DefaultLayout />
        case 'classic':
          return <ClassicLayout />
        case 'transverse':
          return <TransverseLayout />
        case 'columns':
          return <ColumnsLayout />
      }
    }
    return { getLayout }
  },
  render() {
    return <>{this.getLayout()}</>
  }
})
