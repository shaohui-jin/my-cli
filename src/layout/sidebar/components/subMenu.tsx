import { defineAsyncComponent, defineComponent } from 'vue'
import { Route } from '@/types'

const SubMenu = defineAsyncComponent(() => import('./subMenu.tsx'))
const MenuItemGroup = defineAsyncComponent(
  () => import('@/layout/sidebar/components/menuItemGroup.tsx')
)
const MenuItem = defineAsyncComponent(() => import('@/layout/sidebar/components/menuItem.tsx'))

export default defineComponent({
  name: 'SubMenu',
  props: {
    menu: { type: Object as () => Route, required: true }
  },
  render() {
    const menu: Route = this.$props.menu
    return (
      <>
        {menu.children ? (
          <el-sub-menu
            index={menu.path || this.$route.path}
            v-slots={{
              title: () => {
                return (
                  <>
                    <el-icon>{menu.meta?.icon.render()}</el-icon>
                    <span>{menu.name}</span>
                  </>
                )
              }
            }}
          >
            {menu.children.map((child: Route) => {
              return child.meta?.isGroup ? <MenuItemGroup menu={child} /> : <SubMenu menu={child} />
            })}
          </el-sub-menu>
        ) : (
          <MenuItem menu={menu} />
        )}
      </>
    )
  }
})
