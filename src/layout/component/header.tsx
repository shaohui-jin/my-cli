import { defineComponent, computed, defineAsyncComponent } from 'vue'
import { useStore } from '@/store'

const NavBar = defineAsyncComponent(() => import('@/layout/navBar/index.tsx'))

export default defineComponent({
  setup() {
    // 设置 header 的高度
    const headerHeight = computed(() => {
      const { isTagView, layout } = useStore().useThemeStore
      return isTagView && layout !== 'classic' ? '84px' : '50px'
    })
    const tagViewCurrenFull = computed(() => useStore().useRouteStore.tagViewCurrenFull)
    return { headerHeight, tagViewCurrenFull }
  },
  render() {
    const { headerHeight, tagViewCurrenFull } = this
    return (
      <>
        {tagViewCurrenFull ? (
          <div></div>
        ) : (
          <>
            <el-header class="layout-header" height={headerHeight}>
              <NavBar />
            </el-header>
          </>
        )}
      </>
    )
  }
})
