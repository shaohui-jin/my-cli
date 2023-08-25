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
  watch,
  getCurrentInstance
} from 'vue'
import { useStore } from '@/store'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { isMobile, isObjectValueEqual } from '@/utils/common.ts'
import Sortable from 'sortablejs'
import { ElMessage } from 'element-plus'
import { RouteRecordRaw } from '@/router/utils.ts'

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any
    const tagRef = ref([])
    const scrollbarRef = ref()
    const contextmenuRef = ref()
    const tagUlRef = ref()
    const route = useRoute()
    const router = useRouter()

    // 激活的路由
    const routeActive = ref<string>('')
    // 当前的路由地址
    const routePath = ref<string>(route.path)
    // 拖拽的实体
    const sortable = ref<any>()
    // 当前页面tagView的集合
    const tagViews = ref<RouteRecordRaw[]>([])
    // tagView的集合
    const tagViewList = ref<RouteRecordRaw[]>([])

    const state = reactive({
      tagRefIndex: 0
    })

    const tagStyle = computed(() => useStore().useThemeStore.tagStyle)

    // 设置 tagView 高亮
    const isActive = (v: any) => {
      if (useStore().useThemeStore.isShareTagView) {
        return v.path === routePath.value
      } else {
        return v.url ? v.url === routeActive.value : v.path === routeActive.value
      }
    }

    // 更新 tagViewList
    const updateTagView = (tagViewList: Array<RouteRecordRaw>) => (useStore().useRouteStore.tagViewList = tagViewList)

    // 获取 vuex 中的 tagsViewRoutes 列表
    const getTagViewRoutes = async () => {
      routeActive.value = await setTagViewHighlight(route)
      routePath.value = route.meta.isDynamic ? (route.meta.isDynamicPath as string) : route.path
      tagViews.value = []
      tagViewList.value = useStore().useRouteStore.tagViewList
      initTagView()
    }

    // vuex 中获取路由信息：如果是设置了固定的（isAffix），进行初始化显示
    const initTagView = async () => {
      if (useStore().useRouteStore.tagViewList && useStore().useThemeStore.isCacheTagView) {
        tagViews.value = useStore().useRouteStore.tagViewList
      } else {
        await tagViewList.value.map((v: any) => {
          if (v.meta.isAffix && !v.meta.isHide) {
            v.url = setTagViewHighlight(v)
            tagViews.value.push({ ...v })
          }
        })
        await addTagsView(route.path, route)
      }
      // 初始化当前元素(li)的下标
      getTagsRefsIndex(useStore().useThemeStore.isShareTagView ? routePath.value : routeActive.value)
    }
    // 处理可开启多标签详情，单标签详情（动态路由（xxx/:id/:name"），普通路由处理）
    const solveAddTagsView = async (path: string, to?: any) => {
      const isDynamicPath = to.meta.isDynamic ? to.meta.isDynamicPath : path
      const current = tagViews.value.filter(
        (v: any) =>
          v.path === isDynamicPath &&
          isObjectValueEqual(
            to.meta.isDynamic ? (v.params ? v.params : null) : v.query ? v.query : null,
            to.meta.isDynamic ? (to?.params ? to?.params : null) : to?.query ? to?.query : null
          )
      )
      if (current.length <= 0) {
        // 防止：Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.
        const findItem = tagViewList.value.find((v: any) => v.path === isDynamicPath)
        if (findItem.meta.isAffix) return false
        if (findItem.meta.isLink && !findItem.meta.isIframe) return false
        to.meta.isDynamic ? (findItem.params = to.params) : (findItem.query = to.query)
        findItem.url = setTagViewHighlight(findItem)
        tagViews.value.push({ ...findItem })
        updateTagView(tagViews.value)
      }
    }
    // 处理单标签时，第二次的值未覆盖第一次的 tagsViewList 值（Session Storage）
    const singleAddTagsView = (path: string, to?: any) => {
      const isDynamicPath = to.meta.isDynamic ? to.meta.isDynamicPath : path
      tagViews.value.forEach((v: any) => {
        if (
          v.path === isDynamicPath &&
          !isObjectValueEqual(
            to.meta.isDynamic ? (v.params ? v.params : null) : v.query ? v.query : null,
            to.meta.isDynamic ? (to?.params ? to?.params : null) : to?.query ? to?.query : null
          )
        ) {
          to.meta.isDynamic ? (v.params = to.params) : (v.query = to.query)
          v.url = setTagViewHighlight(v)
          updateTagView(tagViews.value)
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
          if (tagViews.value.some((v: any) => v.path === to.meta.isDynamicPath)) return false
          item = tagViewList.value.find((v: any) => v.path === to.meta.isDynamicPath)
        } else {
          // 普通路由：参数不同，开启多个 tagView
          if (!useStore().useThemeStore.isShareTagView) await solveAddTagsView(path, to)
          else await singleAddTagsView(path, to)
          if (tagViews.value.some((v: any) => v.path === path)) return false
          item = tagViewList.value.find((v: any) => v.path === path)
        }
        if (item.meta.isLink && !item.meta.isIframe) return false
        if (to && to.meta.isDynamic) item.params = to?.params ? to?.params : route.params
        else item.query = to?.query ? to?.query : route.query
        item.url = setTagViewHighlight(item)
        await tagViews.value.push({ ...item })
        await updateTagView(tagViews.value)
      })
    }
    // 2、刷新当前 tagsView：
    const refreshCurrentTagView = (fullPath: string) => {
      proxy.mittBus.emit('onTagsViewRefreshRouterView', fullPath)
    }
    // 3、关闭当前 tagsView：如果是设置了固定的（isAffix），不可以关闭
    const closeCurrentTagsView = (path: string) => {
      tagViews.value.map((v: any, k: number, arr: any) => {
        if (!v.meta.isAffix) {
          if (useStore().useThemeStore.isShareTagView ? v.path === path : v.url === path) {
            tagViews.value.splice(k, 1)
            setTimeout(() => {
              if (
                tagViews.value.length === k && useStore().useThemeStore.isShareTagView
                  ? routePath.value === path
                  : routeActive.value === path
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
                  tagViews.value.length !== k && useStore().useThemeStore.isShareTagView
                    ? routePath.value === path
                    : routeActive.value === path
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
      updateTagView(tagViews.value)
    }
    // 4、关闭其它 tagsView：如果是设置了固定的（isAffix），不进行关闭
    const closeOtherTagsView = (path: string) => {
      tagViews.value = []
      tagViewList.value.map((v: any) => {
        if (v.meta.isAffix && !v.meta.isHide) tagViews.value.push({ ...v })
      })
      addTagsView(path, route)
    }
    // 5、关闭全部 tagsView：如果是设置了固定的（isAffix），不进行关闭
    const closeAllTagsView = () => {
      tagViews.value = []
      tagViewList.value.map((v: any) => {
        if (v.meta.isAffix && !v.meta.isHide) {
          tagViews.value.push({ ...v })
          router.push({ path: tagViews.value[tagViews.value.length - 1].path })
        }
      })
      updateTagView(tagViews.value)
    }
    // 6、开启当前页面全屏
    const openCurrenFullscreen = async (path: string) => {
      const item = tagViews.value.find((v: any) =>
        useStore().useThemeStore.isShareTagView ? v.path === path : v.url === path
      )
      if (item.meta.isDynamic) await router.push({ name: item.name, params: item.params })
      else await router.push({ name: item.name, query: item.query })
      useStore().useRouteStore.tagViewCurrenFull = true
    }
    // 当前项右键菜单点击，拿当前点击的路由路径对比 浏览器缓存中的 tagsView 路由数组，取当前点击项的详细路由信息
    // 防止 tagsView 非当前页演示时，操作异常
    const getCurrentRouteItem = (path: string, cParams: { [key: string]: any }) => {
      const itemRoute = useStore().useRouteStore.tagViewList || tagViews.value
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
          refreshCurrentTagView(route.fullPath)
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

    const dropdown = ref<Record<'x' | 'y', string>>({ x: '', y: '' })

    // 右键点击时：传 x,y 坐标值到子组件中（props）
    const onContextmenu = (v: any, e: any) => {
      const { clientX, clientY } = e
      dropdown.value.x = clientX
      dropdown.value.y = clientY
      contextmenuRef.value.openContextmenu(v)
    }
    // 当前的 tagsView 项点击时
    const onTagsClick = (v: any, k: number) => {
      state.tagRefIndex = k
      router.push(v)
    }
    // 处理 tagView 高亮（多标签详情时使用，单标签详情未使用）
    const setTagViewHighlight = (v: any) => {
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
      scrollbarRef.value.update()
      // proxy.$refs.scrollbarRef.$ref.wrap$.update()
    }
    // 鼠标滚轮滚动
    const onHandleScroll = (e: any) => {
      // proxy.$refs.scrollbarRef.$refs.wrap$.scrollLeft += e.wheelDelta / 4
      scrollbarRef.value.scrollLeft += e.wheelDelta / 4
    }
    // tagView 横向滚动
    const tagViewMoveToCurrentTag = () => {
      nextTick(() => {
        if (tagRef.value.length <= 0) return false
        // 当前 li 元素
        const liDom = tagRef.value[state.tagRefIndex]
        // 当前 li 元素下标
        const liIndex = state.tagRefIndex
        // 当前 ul 下 li 元素总长度
        const liLength = tagRef.value.length
        // 最前 li
        const liFirst: any = tagRef.value[0]
        // 最后 li
        const liLast: any = tagRef.value[tagRef.value.length - 1]
        // 当前滚动条的值
        // const scrollRefs = proxy.$refs.scrollbarRef.$refs.wrap$
        const scrollRefs = scrollbarRef.value
        // 当前滚动条滚动宽度
        const scrollS = scrollRefs.scrollWidth
        // 当前滚动条偏移宽度
        const offsetW = scrollRefs.offsetWidth
        // 当前滚动条偏移距离
        const scrollL = scrollRefs.scrollLeft
        // 上一个 tags li dom
        const liPrevTag: any = tagRef.value[state.tagRefIndex - 1]
        // 下一个 tags li dom
        const liNextTag: any = tagRef.value[state.tagRefIndex + 1]
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
        const tagsViewList = await tagViews.value
        state.tagRefIndex = tagsViewList.findIndex((v: any) => {
          if (useStore().useThemeStore.isShareTagView) {
            return v.path === path
          } else {
            return v.url === path
          }
        })
        // 添加初始化横向滚动条移动到对应位置
        tagViewMoveToCurrentTag()
      })
    }

    // 初始化 tagView 拖拽功能
    const initSortable = async () => {
      const el = document.querySelector('.layout-navbar-tagView-ul') as HTMLElement
      if (!el) return false
      console.log(el)
      sortable.value?.el && sortable.value.destroy()
      console.log(el)
      sortable.value = new Sortable(el, {
        animation: 300,
        dataIdAttr: 'data-url',
        disabled: !useStore().useThemeStore.isSortableTagView,
        onEnd: () => {
          const sortEndList: any = []
          sortable.value.toArray().map((val: any) => {
            tagViews.value.map((v: any) => {
              if (v.url === val) sortEndList.push({ ...v })
            })
          })
          updateTagView(sortEndList)
        }
      })
    }
    // 重置 tagView 拖拽功能
    const resizeSortable = async () => {
      await initSortable()
      if (isMobile()) sortable.value.el && sortable.value.destroy()
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
      // 监听布局配置开启 TagView 共用，为了演示还原默认值
      proxy.mittBus.on('openShareTagsView', () => {
        if (useStore().useThemeStore.isShareTagView) {
          router.push('/home')
          tagViews.value = []
          tagViewList.value.map((v: any) => {
            if (v.meta.isAffix && !v.meta.isHide) {
              v.url = setTagViewHighlight(v)
              tagViews.value.push({ ...v })
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
      tagRef.value = []
    })
    // 页面加载时
    onMounted(() => {
      // 初始化 vuex 中的 tagsViewRoutes 列表
      getTagViewRoutes()
      initSortable()
    })
    // 路由更新时
    onBeforeRouteUpdate(async to => {
      routeActive.value = setTagViewHighlight(to)
      routePath.value = to.meta.isDynamic ? to.meta.isDynamicPath : to.path
      await addTagsView(to.path, to)
      getTagsRefsIndex(useStore().useThemeStore.isShareTagView ? routePath.value : routeActive.value)
    })
    // 监听路由的变化，动态赋值给 tagsView
    watch(useStore().useRouteStore.tagViewList, val => {
      if (val.length === tagViewList.value.length) return false
      getTagViewRoutes()
    })

    const themeConfig = computed(() => useStore().useThemeStore)
    return {
      isActive,
      onContextmenu,
      getTagViewRoutes,
      onTagsClick,
      tagRef,
      contextmenuRef,
      scrollbarRef,
      tagUlRef,
      onHandleScroll,
      refreshCurrentTagView,
      closeCurrentTagsView,
      onCurrentContextmenuClick,
      themeConfig,
      tagViewList
    }
  },
  render() {
    const {
      themeConfig,
      tagViewList,
      tagRef,
      onContextmenu,
      refreshCurrentTagView,
      isActive,
      onTagsClick,
      onHandleScroll,
      closeCurrentTagsView
    } = this
    return (
      <>
        <div
          class={{ 'layout-navbar-tagView': true, 'layout-navbar-tagView-shadow': themeConfig.layout === 'classic' }}
        >
          <el-scrollbar
            ref="scrollbarRef"
            nativeOnMousewheel={(event: any) => {
              event.preventDefault()
              onHandleScroll(event)
            }}
          >
            <ul class={{ 'layout-navbar-tagView-ul': true, [themeConfig.tagStyle]: true }} ref="tagUlRef">
              {tagViewList.map((v, k) => {
                return (
                  <>
                    <li
                      key={k}
                      class={{ 'layout-navbar-tagView-ul-li': true, 'is-active': isActive(v) }}
                      data-url={v.url}
                      onContextmenu={$event => {
                        $event.preventDefault()
                        onContextmenu(v, $event)
                      }}
                      onClick={() => onTagsClick(v, k)}
                      ref={el => {
                        if (el) {
                          tagRef[k] = el
                        }
                      }}
                    >
                      {JSON.stringify(v)}
                      {isActive(v) ? (
                        <>
                          <i class="iconfont icon-webicon318 layout-navbar-tagView-ul-li-iconfont font14"></i>
                        </>
                      ) : (
                        <div></div>
                      )}
                      {!isActive(v) && themeConfig.isTagViewIcon ? (
                        <el-icon name={v.meta.icon} class="layout-navbar-tagView-ul-li-iconfont" />
                      ) : (
                        <div></div>
                      )}
                      <span>{v.meta.title}</span>
                      {isActive(v) ? (
                        <>
                          <el-icon
                            name="RefreshRight"
                            class="ml5 layout-navbar-tagView-ul-li-refresh"
                            onClick={(event: any) => {
                              event.stopPropagation()
                              refreshCurrentTagView(this.$route.fullPath)
                            }}
                          />
                          {v.meta.isAffix ? (
                            <></>
                          ) : (
                            <>
                              <el-icon
                                name="Close"
                                class="layout-navbar-tagView-ul-li-icon layout-icon-active"
                                onClick={(event: any) => {
                                  event.stopPropagation()
                                  closeCurrentTagsView(themeConfig.isShareTagView ? v.path : v.url)
                                }}
                              />
                            </>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                      {v.meta.isAffix && (
                        <>
                          <el-icon
                            name="Close"
                            class="layout-navbar-tagView-ul-li-icon layout-icon-three"
                            onClick={(event: any) => {
                              event.stopPropagation()
                              closeCurrentTagsView(themeConfig.isShareTagView ? v.path : v.url)
                            }}
                          />
                        </>
                      )}
                    </li>
                  </>
                )
              })}
            </ul>
          </el-scrollbar>
        </div>
      </>
    )
  }
})
