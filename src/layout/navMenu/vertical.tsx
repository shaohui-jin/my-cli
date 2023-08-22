import { toRefs, reactive, computed, defineComponent, getCurrentInstance, onMounted, watch } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useStore } from '@/store/index'
import SubItem from '@/layout/navMenu/subItem.vue'

export default defineComponent({
  props: {
    menuList: {
      type: Array,
      default: () => []
    }
  },
  setup({ menuList }) {
    const { proxy } = getCurrentInstance() as any
    const state = reactive({
      defaultActive: route.meta.isDynamic ? route.meta.isDynamicPath : route.path,
      isCollapse: false
    })
    // 获取父级菜单数据
    const menuLists = computed(() => menuList)
    // 获取布局配置信息
    const isCollapse = computed(() => useStore().useThemeStore.isCollapse)
    // 菜单高亮（详情时，父级高亮）
    const setParentHighlight = currentRoute => {
      const { path, meta } = currentRoute
      const pathSplit = meta.isDynamic ? meta.isDynamicPath.split('/') : path.split('/')
      if (pathSplit.length >= 4 && meta.isHide) return pathSplit.splice(0, 3).join('/')
      else return path
    }
    // 设置菜单的收起/展开
    watch(
      useStore().useThemeStore,
      () => {
        document.body.clientWidth <= 1000
          ? (state.isCollapse = false)
          : (state.isCollapse = useStore().useThemeStore.isCollapse)
      },
      {
        immediate: true
      }
    )
    // 页面加载时
    onMounted(() => {
      state.defaultActive = setParentHighlight(route)
    })
    // 路由更新时
    onBeforeRouteUpdate(to => {
      state.defaultActive = setParentHighlight(to)
      proxy.mittBus.emit('onMenuClick')
      const clientWidth = document.body.clientWidth
      if (clientWidth < 1000) useStore().useThemeStore.isCollapse = false
    })
    return {
      menuLists,
      isCollapse,
      ...toRefs(state)
    }
  },
  render() {
    const { defaultActive, isCollapse, isUniqueOpened } = this
    return (
      <>
        <el-menu
          router
          defaultActive={defaultActive}
          backgroundColor="transparent"
          onCollapse={isCollapse}
          uniqueOpened={isUniqueOpened}
          collapseTransition={false}
        >
          <div v-for="val in menuLists">
            {val.children && val.children.length > 0 ? (
              <>
                <el-sub-menu
                  index={val.path}
                  key={val.path}
                  v-slots={{
                    title: () => {
                      return (
                        <>
                          <SvgIcon name={val.meta.icon} />
                          <span>{val.meta.title}</span>
                        </>
                      )
                    }
                  }}
                >
                  <SubItem chil={val.children} />
                </el-sub-menu>
              </>
            ) : (
              <>
                <el-menu-item
                  index={val.path}
                  key={val.path}
                  v-slots={{
                    title: () => {
                      return !val.meta.isLink || (val.meta.isLink && val.meta.isIframe) ? (
                        <>
                          <span>{val.meta.title}</span>
                        </>
                      ) : (
                        <>
                          <a href={val.meta.isLink} target="_blank" rel="opener">
                            {val.meta.title}
                          </a>
                        </>
                      )
                    }
                  }}
                >
                  <SvgIcon name={val.meta.icon} />
                </el-menu-item>
              </>
            )}
          </div>
        </el-menu>
      </>
    )
  }
})
