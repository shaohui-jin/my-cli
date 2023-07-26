import { defineAsyncComponent, defineComponent } from 'vue'
import { Menu } from '@/router/menu.config.ts'

const SubMenu = defineAsyncComponent(() => import('./subMenu.tsx'))
const MenuItemGroup = defineAsyncComponent(
  () => import('@/layout/sidebar/components/menuItemGroup.tsx')
)
const MenuItem = defineAsyncComponent(() => import('@/layout/sidebar/components/menuItem.tsx'))

export default defineComponent({
  name: 'SubMenu',
  props: {
    menu: { type: Object as () => Menu, required: true }
  },
  render() {
    const { menu } = this.$props
    return (
      <>
        {menu.childMenu ? (
          <el-sub-menu
            index={menu.route}
            v-slots={{
              title: () => {
                return (
                  <>
                    <el-icon>{menu.icon.render()}</el-icon>
                    <span>{menu.title}</span>
                  </>
                )
              }
            }}
          >
            {menu.childMenu.map((child, index) => {
              return child.isGroup ? <MenuItemGroup menu={child} /> : <SubMenu menu={child} />
            })}
          </el-sub-menu>
        ) : (
          <MenuItem menu={menu} />
        )}
      </>
    )
  }
})
