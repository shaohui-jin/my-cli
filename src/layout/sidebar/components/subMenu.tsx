import { defineAsyncComponent, defineComponent } from 'vue'
const MenuItemGroup: JSX.Element = defineAsyncComponent(
  () => import('@/layout/sidebar/components/menuItemGroup.tsx')
)
const MenuItem = defineAsyncComponent(() => import('@/layout/sidebar/components/menuItem.tsx'))
import { MenuItemType } from '@/router/menuData.ts'
export default defineComponent({
  name: 'SubMenu',
  props: {
    subIndex: { type: String, required: true },
    subIcon: { type: Object, default: () => ({ render: () => {} }) },
    subTitle: { type: String, required: true },
    subRoute: { type: String, default: null },
    childMenu: { type: Array as () => MenuItemType[], default: null }
  },
  setup(props) {
    return {}
  },
  render() {
    const {
      $props: { subIndex, subIcon, subTitle, childMenu, subRoute }
    } = this
    return (
      <>
        {childMenu ? (
          <el-sub-menu
            index={subIndex}
            v-slots={{
              title: () => {
                return (
                  <>
                    {subIcon ? <el-icon>{subIcon.render()}</el-icon> : <></>}
                    <span>{subTitle}</span>
                  </>
                )
              }
            }}
          >
            {childMenu.map((child, index) => {
              return child.isGroup ? (
                <>
                  <MenuItemGroup
                    groupTitle={child.title}
                    groupIndex={`${subIndex}.${index + 1}`}
                    groupRoute={subRoute}
                    childMenu={child?.childMenu}
                  />
                </>
              ) : (
                <>
                  <SubMenu
                    subIcon={child.icon}
                    subTitle={child.title}
                    subIndex={`${subIndex}.${index + 1}`}
                    subRoute={subRoute}
                    childMenu={child?.childMenu}
                  />
                </>
              )
            })}
          </el-sub-menu>
        ) : (
          <MenuItem
            menuIndex={`${subIndex}`}
            menuTitle={subTitle}
            menuIcon={subIcon}
            menuRoute={subRoute}
          />
        )}
      </>
    )
  }
})
