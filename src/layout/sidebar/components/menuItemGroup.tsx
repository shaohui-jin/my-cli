import { defineAsyncComponent, defineComponent } from 'vue'
import { MenuItemGroup } from '@/types'
const MenuItem = defineAsyncComponent(() => import('@/layout/sidebar/components/menuItem.tsx'))
export default defineComponent({
  name: 'MenuItemGroup',
  props: {
    menu: { type: Object as () => MenuItemGroup, required: true }
  },
  render() {
    const { menu } = this.$props
    return (
      <>
        <el-menu-item-group
          v-slots={{
            title: () => (
              <>
                <el-icon>{menu.icon.render()}</el-icon>
                <span>{menu.title}</span>
              </>
            )
          }}
        >
          {menu.childMenu.map(child => (
            <MenuItem menu={child} />
          ))}
        </el-menu-item-group>
      </>
    )
  }
})
