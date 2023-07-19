import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuItemGroup',
  props: {
    groupIndex: {
      type: String,
    },
    // subIcon: {
    //   type: Object,
    //   default: () =>  ({ render: () => {} })
    // },
    groupTitle: {
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
      $props: { groupIndex, groupTitle, childMenu }
    } = this
    return <>
      <el-menu-item-group
        v-slots={ {
          title: () => <span>{ groupTitle }</span>
        } }
      >
        { childMenu.map((child, index) => {
          return <>
            <el-menu-item index={ `${ groupIndex }.${index}` }>{ child.title }</el-menu-item>
          </>
        }) }
      </el-menu-item-group>
    </>
  }
})