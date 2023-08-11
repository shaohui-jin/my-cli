import { defineAsyncComponent, defineComponent } from 'vue'
import { Route } from '@/types'
const MenuItem = defineAsyncComponent(() => import('@/layout/sidebar/components/menuItem.tsx'))
export default defineComponent({
  name: 'MenuItemGroup',
  props: {
    menu: { type: Object as () => Route, required: true }
  },
  render() {
    const menu: Route = this.$props.menu
    return (
      <>
        <el-menu-item-group
          v-slots={{
            title: () => (
              <>
                <el-icon>{menu.meta?.icon.render()}</el-icon>
                <span>{menu.name}</span>
              </>
            )
          }}
        >
          {menu.children?.map((child: Route) => <MenuItem menu={child} />)}
        </el-menu-item-group>
      </>
    )
  }
})
