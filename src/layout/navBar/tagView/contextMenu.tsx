import { defineComponent, ref, computed, Transition } from 'vue'
import { RefreshRight, Close, CircleClose, FolderDelete } from '@element-plus/icons-vue'
type ContextMenu = {
  id: number
  txt: string
  affix: boolean
  icon: () => any
}
export default defineComponent({
  props: {
    dropDown: {
      type: Object as () => Record<'x' | 'y', number>,
      required: true
    }
  },
  emits: ['contextMenuClick'],
  setup(props, { emit }) {
    const contextMenus = ref<ContextMenu[]>([
      {
        id: 0,
        txt: '刷新',
        affix: false,
        icon: () => (
          <el-icon>
            <RefreshRight />
          </el-icon>
        )
      },
      {
        id: 1,
        txt: '关闭',
        affix: false,
        icon: () => (
          <el-icon>
            <Close />
          </el-icon>
        )
      },
      {
        id: 2,
        txt: '关闭其他',
        affix: false,
        icon: () => (
          <el-icon>
            <CircleClose />
          </el-icon>
        )
      },
      {
        id: 3,
        txt: '全部关闭',
        affix: false,
        icon: () => (
          <el-icon>
            <FolderDelete />
          </el-icon>
        )
      },
      {
        id: 4,
        txt: '当前页全屏',
        affix: false,
        icon: () => <i class="iconfont icon-fullscreen font14" />
      }
    ])

    // 是否显示
    const isShow = ref<boolean>(false)

    // 当前tab的路由
    const item = ref<object>({})

    // 左侧距离
    const arrowLeft = computed(() => {
      const { x } = props.dropDown
      if (x + 117 > document.documentElement.clientWidth) {
        return 117 - (document.documentElement.clientWidth - x)
      } else {
        return 10
      }
    })

    // 顶部坐标
    const pointer = computed(() => {
      const { x, y } = props.dropDown
      if (x + 117 > document.documentElement.clientWidth) {
        return {
          x: document.documentElement.clientWidth - 117 - 5,
          y: y
        }
      } else {
        return { x, y }
      }
    })

    // 当前项菜单点击
    const contextMenuClick = (id: number) => emit('contextMenuClick', { id, ...item.value })

    // 打开右键菜单：判断是否固定，固定则不显示关闭按钮
    const openContextMenu = (route: any) => {
      item.value = route
      route.meta.isAffix ? (contextMenus.value[1].affix = true) : (contextMenus.value[1].affix = false)
      closeContextmenu()
      setTimeout(() => {
        isShow.value = true
      }, 10)
    }

    // 关闭右键菜单
    const closeContextmenu = () => (isShow.value = false)

    return { pointer, isShow, arrowLeft, contextMenus, openContextMenu, closeContextmenu, contextMenuClick }
  },
  render() {
    const { isShow, arrowLeft, contextMenus, pointer, contextMenuClick, closeContextmenu } = this
    return (
      <>
        <Transition name="el-zoom-in-center">
          {isShow ? (
            <div
              aria-hidden="true"
              class="el-dropdown__popper el-popper is-light is-pure custom-contextmenu"
              role="tooltip"
              data-popper-placement="bottom"
              style={`top: ${pointer.y + 5}px;left: ${pointer.x}px;`}
              key={Math.random()}
            >
              <ul class="el-dropdown-menu">
                {contextMenus.map((v, k) => {
                  return (
                    <>
                      {!v.affix && (
                        <li
                          class="el-dropdown-menu__item"
                          aria-disabled="false"
                          tabindex="-1"
                          key={k}
                          v-click-outside:true={closeContextmenu}
                          onClick={() => contextMenuClick(v.id)}
                        >
                          {v.icon()}
                          <span>{v.txt}</span>
                        </li>
                      )}
                    </>
                  )
                })}
              </ul>
              <div class="el-popper__arrow" style={{ left: `${arrowLeft}px` }}></div>
            </div>
          ) : (
            <div></div>
          )}
        </Transition>
      </>
    )
  }
})
