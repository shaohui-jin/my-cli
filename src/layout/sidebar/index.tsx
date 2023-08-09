import { defineComponent, defineAsyncComponent, computed } from 'vue'
import { routes } from '@/constant'
import { ThemeStore } from '@/store/modules/theme.ts'
import './sidebar.less'
const SubMenu = defineAsyncComponent(() => import('@/layout/sidebar/components/subMenu.tsx'))

export default defineComponent({
  name: 'SLASidebar',
  props: {
    maxWidth: {
      type: Number,
      required: true
    }
  },
  setup() {
    const handleOpen = (key: string, keyPath: string[]) => console.log(key, keyPath)
    const handleClose = (key: string, keyPath: string[]) => console.log(key, keyPath)
    const themeSore = ThemeStore()
    const isCollapse = computed(() => themeSore.getTheme().sidebar.isCollapse)
    return { isCollapse, handleClose, handleOpen }
  },
  render() {
    const { isCollapse, handleOpen, handleClose } = this
    const menuItems: JSX.Element[] = routes.map(menu => <SubMenu menu={menu} />)
    return (
      <>
        <div
          class="SLA-sidebar-container"
          style={{ width: isCollapse ? 'auto' : `${this.$props.maxWidth}px` }}
        >
          <el-menu
            class="sidebar-menu"
            default-active={this.$route.path}
            mode="vertical"
            collapse={isCollapse}
            onOpen={handleOpen}
            onClose={handleClose}
            router
          >
            {menuItems}
          </el-menu>
        </div>
      </>
    )
  }
})
