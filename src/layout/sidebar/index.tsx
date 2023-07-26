import { ref, defineComponent, defineAsyncComponent } from 'vue'
import { menu } from '@/router/menu.config.ts'
const SubMenu = defineAsyncComponent(() => import('@/layout/sidebar/components/subMenu.tsx'))

export default defineComponent({
  name: 'SidebarMenu',
  setup() {
    const isCollapse = ref<boolean>(false)
    const handleOpen = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    const handleClose = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    return { isCollapse, handleClose, handleOpen }
  },
  render() {
    const { isCollapse, handleOpen, handleClose } = this
    return (
      <>
        {/*<el-radio-group v-model={isCollapse} style={{ marginBottom: '20px' }}>*/}
        {/*  <el-radio-button label={false}>expand</el-radio-button>*/}
        {/*  <el-radio-button label={true}>collapse</el-radio-button>*/}
        {/*</el-radio-group>*/}
        <el-menu
          default-active={this.$route.path}
          class="el-menu-vertical-demo"
          mode="vertical"
          collapse={isCollapse}
          onOpen={handleOpen}
          onClose={handleClose}
          router
        >
          {menu.map(menu => (
            <SubMenu menu={menu} />
          ))}
        </el-menu>
      </>
    )
  }
})
