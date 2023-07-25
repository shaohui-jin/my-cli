import { defineAsyncComponent, defineComponent } from 'vue'
import { MenuItemType } from '@/router/menuData.ts'
const MenuItem = defineAsyncComponent(() => import('@/layout/sidebar/components/menuItem.tsx'))
export default defineComponent({
  name: 'MenuItemGroup',
  props: {
    groupIndex: { type: String, required: true },
    groupTitle: { type: String, required: true },
    groupRoute: { type: String, default: null },
    childMenu: { type: Array as () => MenuItemType[], required: true }
  },
  render() {
    const {
      $props: { groupIndex, groupTitle, groupRoute, childMenu }
    } = this
    return (
      <>
        <el-menu-item-group
          v-slots={{
            title: () => <span>{groupTitle}</span>
          }}
        >
          {childMenu.map((child, index) => (
            <MenuItem
              menuIndex={`${groupIndex}.${index}`}
              menuTitle={child.title}
              menuRoute={groupRoute}
            />
          ))}
        </el-menu-item-group>
      </>
    )
  }
})
