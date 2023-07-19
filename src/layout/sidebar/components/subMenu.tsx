import { defineAsyncComponent, defineComponent } from 'vue'
const MenuItemGroup: JSX.Element = defineAsyncComponent(() => import('@/layout/sidebar/components/menuItemGroup.tsx'))

export default defineComponent({
  name: 'SubMenu',
  props: {
    subIndex: {
      type: String,
    },
    subIcon: {
      type: Object,
      default: () =>  ({ render: () => {} })
    },
    subTitle: {
      type: String
    },
    childMenu: {
      type: Array,
      default: () => ([])
    }
  },
  setup(props) {
    return {}
  },
  render() {
    const {
      $props: { subIndex, subIcon, subTitle, childMenu}
    } = this
    // const childMenu: SubMenu | MenuItemGroup = this.$props.childMenu
    return <>
      <el-sub-menu
        index={ subIndex }
        v-slots={ {
          title: () => {
            return <>
              { subIcon ? <el-icon>{ subIcon.render() }</el-icon> : <></> }
              <span>{ subTitle }</span>
            </>
          }
        } }
      >
        { childMenu.length !== 0 && childMenu.map((child, index) => {
          return child.isGroup
            ? <>
              <MenuItemGroup
                groupTitle={ child.title }
                groupIndex={ `${ subIndex }.${ index + 1 }` }
                childMenu={ child?.childMenu || [] }
              />
            </>
            : <>
              <SubMenu
                subIcon={ child?.icon }
                subTitle={ child.title }
                subIndex={ `${ subIndex }.${ index + 1 }` }
                childMenu={ child?.childMenu || [] }
              />
            </>
        }) }
      </el-sub-menu>
    </>
  }
})