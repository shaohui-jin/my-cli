import { defineAsyncComponent, defineComponent, computed } from 'vue'
import { useStore } from '@/store'

const TagView = defineAsyncComponent(() => import('@/layout/navBar/tagView'))
const Breadcrumb = defineAsyncComponent(() => import('@/layout/navBar/breadcrumb'))
export default defineComponent({
  setup() {
    const isTagView = computed(() => {
      const { layout, isTagView } = useStore().useThemeStore
      return layout !== 'classic' && isTagView
    })
    return {
      isTagView
    }
  },
  render() {
    const { isTagView } = this
    return (
      <>
        <div class="layout-navbars-container">
          <Breadcrumb />
          {isTagView ? <TagView /> : <div></div>}
        </div>
      </>
    )
  }
})
