import { defineComponent, computed, defineAsyncComponent } from 'vue'
import { useStore } from '@/store'
const Aside = defineAsyncComponent(() => import('@/layout/component/aside.tsx'))
const Header = defineAsyncComponent(() => import('@/layout/component/header.tsx'))
const Main = defineAsyncComponent(() => import('@/layout/component/main.tsx'))

// import TagView from '@/layout/navBars/tagView/tagView.vue';

export default defineComponent({
  setup() {
    // 获取布局配置信息
    const isTagView = computed(() => useStore().useThemeStore.isTagView)
    return { isTagView }
  },
  render() {
    return (
      <>
        <el-container class={['layout-container', 'flex-center']}>
          <Header />
          <el-container class="layout-main-height-50">
            <Aside />
            <div class={['flex-center', 'layout-backtop']}>
              {/*<TagView v-if="isTagView" />*/}
              <Main />
            </div>
          </el-container>
          <el-backtop target=".layout-backtop .el-main .el-scrollbar__wrap"></el-backtop>
        </el-container>
      </>
    )
  }
})
