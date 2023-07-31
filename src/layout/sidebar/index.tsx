import { defineComponent, defineAsyncComponent, computed } from 'vue'
import { defaultMenuConfig } from '@/constant'
import { ThemeStore } from '@/store/modules/theme.ts'
const SubMenu = defineAsyncComponent(() => import('@/layout/sidebar/components/subMenu.tsx'))

export default defineComponent({
  name: 'SLASidebar',
  setup() {
    const handleOpen = (key: string, keyPath: string[]) => console.log(key, keyPath)
    const handleClose = (key: string, keyPath: string[]) => console.log(key, keyPath)

    const themeSore = ThemeStore()
    const isCollapse = computed(() => themeSore.getTheme().sidebar.isCollapse)
    return { isCollapse, handleClose, handleOpen }
  },
  render() {
    const { isCollapse, handleOpen, handleClose } = this
    const menuItems: JSX.Element[] = defaultMenuConfig.map(menu => <SubMenu menu={menu} />)
    return (
      <>
        <el-menu
          default-active={this.$route.path}
          class="el-menu-vertical-demo"
          mode="vertical"
          collapse={isCollapse}
          onOpen={handleOpen}
          onClose={handleClose}
          router
        >
          {menuItems}
        </el-menu>
      </>
    )
  }
})
