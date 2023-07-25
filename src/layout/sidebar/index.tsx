import { ref, defineComponent, defineAsyncComponent } from 'vue'
import { menu } from '@/router/menuData.ts'

const SubMenu = defineAsyncComponent(() => import('@/layout/sidebar/components/subMenu.tsx'))

export default defineComponent({
  name: 'SidebarMenu',
  // components: {
  //   SubMenu
  // },
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
          default-active="2"
          class="el-menu-vertical-demo"
          mode="vertical"
          collapse={isCollapse}
          onOpen={handleOpen}
          onClose={handleClose}
        >
          {menu.map((subMenu, subIndex) => (
            <SubMenu
              subIcon={subMenu.icon}
              subTitle={subMenu.title}
              subIndex={`${subIndex + 1}`}
              subRoute={subMenu.route}
              childMenu={subMenu.childMenu}
            />
          ))}
        </el-menu>
      </>
    )
  }
})
