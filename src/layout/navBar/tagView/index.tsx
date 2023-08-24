import {
  onBeforeMount,
  onUnmounted,
  onBeforeUpdate,
  onMounted,
  computed,
  defineComponent,
  nextTick,
  reactive,
  ref,
  toRefs,
  watch,
  getCurrentInstance
} from 'vue'
import store, { useStore } from '@/store'
import { onBeforeRouteUpdate, RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import { isMobile, isObjectValueEqual } from '@/utils/common.ts'
import Sortable from 'sortablejs'
import { ElMessage } from 'element-plus'
export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any
    const tagsRefs = ref([])
    const scrollbarRef = ref()
    const contextmenuRef = ref()
    const tagsUlRef = ref()
    const route = useRoute()
    const router = useRouter()
    const state: any = reactive({
      routeActive: '',
      routePath: route.path,
      dropdown: { x: '', y: '' },
      tagsRefsIndex: 0,
      tagsViewList: [],
      sortable: '',
      tagsViewRoutesList: []
    })

    const tagStyle = computed(() => useStore().useThemeStore.tagStyle)

    // 设置 tagView 高亮
    const isActive = (v: any) => {
      if (useStore().useThemeStore.isShareTagView) {
        return v.path === state.routePath
      } else {
        return v.url ? v.url === state.routeActive : v.path === state.routeActive
      }
    }

    // 存储 tagsViewList
    const addBrowserSetSession = (tagViewList: Array<RouteRecordRaw>) =>
      (useStore().useRouteStore.tagViewList = tagViewList)

    // 获取 vuex 中的 tagsViewRoutes 列表
    const getTagViewRoutes = async () => {
      state.routeActive = await setTagsViewHighlight(route)
      state.routePath = (await route.meta.isDynamic) ? route.meta.isDynamicPath : route.path
      state.tagViewList = []
      state.tagViewRoutesList = useStore().useRouteStore.tagViewList
      initTagsView()
    }

    // vuex 中获取路由信息：如果是设置了固定的（isAffix），进行初始化显示
    const initTagsView = async () => {
      if (useStore().useRouteStore.tagViewList && useStore().useThemeStore.isCacheTagView) {
        state.tagViewList = useStore().useRouteStore.tagViewList
      } else {
        await state.tagViewRoutesList.map((v: any) => {
          if (v.meta.isAffix && !v.meta.isHide) {
            v.url = setTagsViewHighlight(v)
            state.tagViewList.push({ ...v })
          }
        })
        await addTagsView(route.path, route)
      }
      // 初始化当前元素(li)的下标
      getTagsRefsIndex(useStore().useThemeStore.isShareTagView ? state.routePath : state.routeActive)
    }
    // 处理可开启多标签详情，单标签详情（动态路由（xxx/:id/:name"），普通路由处理）
    const solveAddTagsView = async (path: string, to?: any) => {
      const isDynamicPath = to.meta.isDynamic ? to.meta.isDynamicPath : path
      const current = state.tagViewList.filter(
        (v: any) =>
          v.path === isDynamicPath &&
          isObjectValueEqual(
            to.meta.isDynamic ? (v.params ? v.params : null) : v.query ? v.query : null,
            to.meta.isDynamic ? (to?.params ? to?.params : null) : to?.query ? to?.query : null
          )
      )
      if (current.length <= 0) {
        // 防止：Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.
        const findItem = state.tagViewRoutesList.find((v: any) => v.path === isDynamicPath)
        if (findItem.meta.isAffix) return false
        if (findItem.meta.isLink && !findItem.meta.isIframe) return false
        to.meta.isDynamic ? (findItem.params = to.params) : (findItem.query = to.query)
        findItem.url = setTagsViewHighlight(findItem)
        state.tagViewList.push({ ...findItem })
        addBrowserSetSession(state.tagViewList)
      }
    }
    // 处理单标签时，第二次的值未覆盖第一次的 tagsViewList 值（Session Storage）
    const singleAddTagsView = (path: string, to?: any) => {
      const isDynamicPath = to.meta.isDynamic ? to.meta.isDynamicPath : path
      state.tagViewList.forEach((v: any) => {
        if (
          v.path === isDynamicPath &&
          !isObjectValueEqual(
            to.meta.isDynamic ? (v.params ? v.params : null) : v.query ? v.query : null,
            to.meta.isDynamic ? (to?.params ? to?.params : null) : to?.query ? to?.query : null
          )
        ) {
          to.meta.isDynamic ? (v.params = to.params) : (v.query = to.query)
          v.url = setTagsViewHighlight(v)
          addBrowserSetSession(state.tagViewList)
        }
      })
    }
    // 1、添加 tagsView：未设置隐藏（isHide）也添加到在 tagsView 中（可开启多标签详情，单标签详情）
    const addTagsView = (path: string, to?: any) => {
      // 防止拿取不到路由信息
      nextTick(async () => {
        let item: RouteRecordRaw = {}
        if (to && to.meta.isDynamic) {
          // 动态路由（xxx/:id/:name"）：参数不同，开启多个 tagView
          if (!useStore().useThemeStore.isShareTagView) await solveAddTagsView(path, to)
          else await singleAddTagsView(path, to)
          if (state.tagViewList.some((v: any) => v.path === to.meta.isDynamicPath)) return false
          item = state.tagViewRoutesList.find((v: any) => v.path === to.meta.isDynamicPath)
        } else {
          // 普通路由：参数不同，开启多个 tagView
          if (!useStore().useThemeStore.isShareTagView) await solveAddTagsView(path, to)
          else await singleAddTagsView(path, to)
          if (state.tagViewList.some((v: any) => v.path === path)) return false
          item = state.tagViewRoutesList.find((v: any) => v.path === path)
        }
        if (item.meta.isLink && !item.meta.isIframe) return false
        if (to && to.meta.isDynamic) item.params = to?.params ? to?.params : route.params
        else item.query = to?.query ? to?.query : route.query
        item.url = setTagsViewHighlight(item)
        await state.tagViewList.push({ ...item })
        await addBrowserSetSession(state.tagViewList)
      })
    }
    // 2、刷新当前 tagsView：
    const refreshCurrentTagsView = (fullPath: string) => {
      proxy.mittBus.emit('onTagsViewRefreshRouterView', fullPath)
    }
    // 3、关闭当前 tagsView：如果是设置了固定的（isAffix），不可以关闭
    const closeCurrentTagsView = (path: string) => {
      state.tagViewList.map((v: any, k: number, arr: any) => {
        if (!v.meta.isAffix) {
          if (useStore().useThemeStore.isShareTagView ? v.path === path : v.url === path) {
            state.tagViewList.splice(k, 1)
            setTimeout(() => {
              if (
                state.tagViewList.length === k && useStore().useThemeStore.isShareTagView
                  ? state.routePath === path
                  : state.routeActive === path
              ) {
                // 最后一个且高亮时
                if (arr[arr.length - 1].meta.isDynamic) {
                  // 动态路由（xxx/:id/:name"）
                  if (k !== arr.length) router.push({ name: arr[k].name, params: arr[k].params })
                  else router.push({ name: arr[arr.length - 1].name, params: arr[arr.length - 1].params })
                } else {
                  // 普通路由
                  if (k !== arr.length) router.push({ path: arr[k].path, query: arr[k].query })
                  else router.push({ path: arr[arr.length - 1].path, query: arr[arr.length - 1].query })
                }
              } else {
                // 非最后一个且高亮时，跳转到下一个
                if (
                  state.tagViewList.length !== k && useStore().useThemeStore.isShareTagView
                    ? state.routePath === path
                    : state.routeActive === path
                ) {
                  if (arr[k].meta.isDynamic) {
                    // 动态路由（xxx/:id/:name"）
                    router.push({ name: arr[k].name, params: arr[k].params })
                  } else {
                    // 普通路由
                    router.push({ path: arr[k].path, query: arr[k].query })
                  }
                }
              }
            }, 0)
          }
        }
      })
      addBrowserSetSession(state.tagViewList)
    }
    // 4、关闭其它 tagsView：如果是设置了固定的（isAffix），不进行关闭
    const closeOtherTagsView = (path: string) => {
      state.tagViewList = []
      state.tagViewRoutesList.map((v: any) => {
        if (v.meta.isAffix && !v.meta.isHide) state.tagViewList.push({ ...v })
      })
      addTagsView(path, route)
    }
    // 5、关闭全部 tagsView：如果是设置了固定的（isAffix），不进行关闭
    const closeAllTagsView = () => {
      state.tagViewList = []
      state.tagViewRoutesList.map((v: any) => {
        if (v.meta.isAffix && !v.meta.isHide) {
          state.tagViewList.push({ ...v })
          router.push({ path: state.tagViewList[state.tagViewList.length - 1].path })
        }
      })
      addBrowserSetSession(state.tagViewList)
    }
    // 6、开启当前页面全屏
    const openCurrenFullscreen = async (path: string) => {
      const item = state.tagViewList.find((v: any) =>
        useStore().useThemeStore.isShareTagView ? v.path === path : v.url === path
      )
      if (item.meta.isDynamic) await router.push({ name: item.name, params: item.params })
      else await router.push({ name: item.name, query: item.query })
      useStore().useRouteStore.tagViewCurrenFull = true
    }
    // 当前项右键菜单点击，拿当前点击的路由路径对比 浏览器缓存中的 tagsView 路由数组，取当前点击项的详细路由信息
    // 防止 tagsView 非当前页演示时，操作异常
    const getCurrentRouteItem = (path: string, cParams: { [key: string]: any }) => {
      const itemRoute = useStore().useRouteStore.tagViewList || state.tagViewList
      return itemRoute.find((v: any) => {
        if (
          v.path === path &&
          isObjectValueEqual(
            v.meta.isDynamic ? (v.params ? v.params : null) : v.query ? v.query : null,
            cParams && Object.keys(cParams ? cParams : {}).length > 0 ? cParams : null
          )
        ) {
          return v
        } else if (v.path === path && Object.keys(cParams ? cParams : {}).length <= 0) {
          return v
        }
      })
    }
    // 当前项右键菜单点击
    const onCurrentContextmenuClick = async item => {
      const cParams = item.meta.isDynamic ? item.params : item.query
      if (!getCurrentRouteItem(item.path, cParams))
        return ElMessage({ type: 'warning', message: '请正确输入路径及完整参数（query、params）' })
      const { path, name, params, query, meta, url } = getCurrentRouteItem(item.path, cParams)
      switch (item.contextMenuClickId) {
        case 0:
          // 刷新当前
          if (meta.isDynamic) await router.push({ name, params })
          else await router.push({ path, query })
          refreshCurrentTagsView(route.fullPath)
          break
        case 1:
          // 关闭当前
          closeCurrentTagsView(useStore().useThemeStore.isShareTagView ? path : url)
          break
        case 2:
          // 关闭其它
          if (meta.isDynamic) await router.push({ name, params })
          else await router.push({ path, query })
          closeOtherTagsView(path)
          break
        case 3:
          // 关闭全部
          closeAllTagsView()
          break
        case 4:
          // 开启当前页面全屏
          openCurrenFullscreen(useStore().useThemeStore.isShareTagView ? path : url)
          break
      }
    }
    // 右键点击时：传 x,y 坐标值到子组件中（props）
    const onContextmenu = (v: any, e: any) => {
      const { clientX, clientY } = e
      state.dropdown.x = clientX
      state.dropdown.y = clientY
      contextmenuRef.value.openContextmenu(v)
    }
    // 当前的 tagsView 项点击时
    const onTagsClick = (v: any, k: number) => {
      state.tagsRefsIndex = k
      router.push(v)
    }
    // 处理 tagsView 高亮（多标签详情时使用，单标签详情未使用）
    const setTagsViewHighlight = (v: any) => {
      const params = v.query && Object.keys(v.query).length > 0 ? v.query : v.params
      if (!params || Object.keys(params).length <= 0) return v.path
      let path = ''
      for (const i in params) {
        path += params[i]
      }
      // 判断是否是动态路由（xxx/:id/:name"）
      return `${v.meta.isDynamic ? v.meta.isDynamicPath : v.path}-${path}`
    }
    // 更新滚动条显示
    const updateScrollbar = () => {
      proxy.$refs.scrollbarRef.update()
    }
    // 鼠标滚轮滚动
    const onHandleScroll = (e: any) => {
      proxy.$refs.scrollbarRef.$refs.wrap$.scrollLeft += e.wheelDelta / 4
    }
    // tagsView 横向滚动
    const tagsViewmoveToCurrentTag = () => {
      nextTick(() => {
        if (tagsRefs.value.length <= 0) return false
        // 当前 li 元素
        const liDom = tagsRefs.value[state.tagsRefsIndex]
        // 当前 li 元素下标
        const liIndex = state.tagsRefsIndex
        // 当前 ul 下 li 元素总长度
        const liLength = tagsRefs.value.length
        // 最前 li
        const liFirst: any = tagsRefs.value[0]
        // 最后 li
        const liLast: any = tagsRefs.value[tagsRefs.value.length - 1]
        // 当前滚动条的值
        const scrollRefs = proxy.$refs.scrollbarRef.$refs.wrap$
        // 当前滚动条滚动宽度
        const scrollS = scrollRefs.scrollWidth
        // 当前滚动条偏移宽度
        const offsetW = scrollRefs.offsetWidth
        // 当前滚动条偏移距离
        const scrollL = scrollRefs.scrollLeft
        // 上一个 tags li dom
        const liPrevTag: any = tagsRefs.value[state.tagsRefsIndex - 1]
        // 下一个 tags li dom
        const liNextTag: any = tagsRefs.value[state.tagsRefsIndex + 1]
        // 上一个 tags li dom 的偏移距离
        let beforePrevL: any = ''
        // 下一个 tags li dom 的偏移距离
        let afterNextL: any = ''
        if (liDom === liFirst) {
          // 头部
          scrollRefs.scrollLeft = 0
        } else if (liDom === liLast) {
          // 尾部
          scrollRefs.scrollLeft = scrollS - offsetW
        } else {
          // 非头/尾部
          if (liIndex === 0) beforePrevL = liFirst.offsetLeft - 5
          else beforePrevL = liPrevTag?.offsetLeft - 5
          if (liIndex === liLength) afterNextL = liLast.offsetLeft + liLast.offsetWidth + 5
          else afterNextL = liNextTag.offsetLeft + liNextTag.offsetWidth + 5
          if (afterNextL > scrollL + offsetW) {
            scrollRefs.scrollLeft = afterNextL - offsetW
          } else if (beforePrevL < scrollL) {
            scrollRefs.scrollLeft = beforePrevL
          }
        }
        // 更新滚动条，防止不出现
        updateScrollbar()
      })
    }
    // 获取 tagsView 的下标：用于处理 tagsView 点击时的横向滚动
    const getTagsRefsIndex = (path: string) => {
      nextTick(async () => {
        // await 使用该写法，防止拿取不到 tagsViewList 列表数据不完整
        const tagsViewList = await state.tagViewList
        state.tagsRefsIndex = tagsViewList.findIndex((v: any) => {
          if (useStore().useThemeStore.isShareTagView) {
            return v.path === path
          } else {
            return v.url === path
          }
        })
        // 添加初始化横向滚动条移动到对应位置
        tagsViewmoveToCurrentTag()
      })
    }

    // 初始化 tagView 拖拽功能
    const initSortable = async () => {
      const el = document.querySelector('.layout-navbar-tagView-ul') as HTMLElement
      if (!el) return false
      state.sortable.el && state.sortable.destroy()
      state.sortable = Sortable.create(el, {
        animation: 300,
        dataIdAttr: 'data-url',
        disabled: !useStore().useThemeStore.isSortableTagView,
        onEnd: () => {
          const sortEndList: any = []
          state.sortable.toArray().map((val: any) => {
            state.tagViewList.map((v: any) => {
              if (v.url === val) sortEndList.push({ ...v })
            })
          })
          addBrowserSetSession(sortEndList)
        }
      })
    }
    // 重置 tagView 拖拽功能
    const resizeSortable = async () => {
      await initSortable()
      if (isMobile()) state.sortable.el && state.sortable.destroy()
    }

    // 页面加载前
    onBeforeMount(() => {
      // 初始化，防止手机端直接访问时还可以拖拽
      resizeSortable()
      window.addEventListener('resize', resizeSortable)
      // 监听非本页面调用 0 刷新当前，1 关闭当前，2 关闭其它，3 关闭全部 4 当前页全屏
      proxy.mittBus.on('onCurrentContextmenuClick', (data: object) => {
        onCurrentContextmenuClick(data)
      })
      // 监听布局配置界面开启/关闭拖拽
      proxy.mittBus.on('openOrCloseSortable', () => {
        initSortable()
      })
      // 监听布局配置开启 TagsView 共用，为了演示还原默认值
      proxy.mittBus.on('openShareTagsView', () => {
        if (useStore().useThemeStore.isShareTagView) {
          router.push('/home')
          state.tagViewList = []
          state.tagViewRoutesList.map((v: any) => {
            if (v.meta.isAffix && !v.meta.isHide) {
              v.url = setTagsViewHighlight(v)
              state.tagViewList.push({ ...v })
            }
          })
        }
      })
    })
    // 页面卸载时
    onUnmounted(() => {
      // 取消非本页面调用监听
      proxy.mittBus.off('onCurrentContextmenuClick')
      // 取消监听布局配置界面开启/关闭拖拽
      proxy.mittBus.off('openOrCloseSortable')
      // 取消监听布局配置开启 TagsView 共用
      proxy.mittBus.off('openShareTagsView')
      // 取消窗口 resize 监听
      window.removeEventListener('resize', resizeSortable)
    })
    // 页面更新时
    onBeforeUpdate(() => {
      tagsRefs.value = []
    })
    // 页面加载时
    onMounted(() => {
      // 初始化 vuex 中的 tagsViewRoutes 列表
      getTagViewRoutes()
      initSortable()
    })
    // 路由更新时
    onBeforeRouteUpdate(async to => {
      state.routeActive = setTagsViewHighlight(to)
      state.routePath = to.meta.isDynamic ? to.meta.isDynamicPath : to.path
      await addTagsView(to.path, to)
      getTagsRefsIndex(useStore().useThemeStore.isShareTagView ? state.routePath : state.routeActive)
    })
    // 监听路由的变化，动态赋值给 tagsView
    watch(store.state, val => {
      if (val.tagsViewRoutes.tagsViewRoutes.length === state.tagViewRoutesList.length) return false
      getTagViewRoutes()
    })
    return {
      isActive,
      onContextmenu,
      getTagViewRoutes,
      onTagsClick,
      tagsRefs,
      contextmenuRef,
      scrollbarRef,
      tagsUlRef,
      onHandleScroll,
      refreshCurrentTagsView,
      closeCurrentTagsView,
      onCurrentContextmenuClick,
      ...toRefs(state)
    }
  },
  render() {
    return <>323423</>
  }
})
