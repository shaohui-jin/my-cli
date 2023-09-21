import { defineAsyncComponent, defineComponent, computed } from 'vue'
import { useStore } from '@/store'

const TagView = defineAsyncComponent(() => import('@/layout/navBar/tagView'))
const Navigation = defineAsyncComponent(() => import('@/layout/navBar/navigation/index.tsx'))
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
        <div class="layout-navbar-container">
          <Navigation />
          {isTagView && <TagView />}
        </div>
      </>
    )
  }
})
