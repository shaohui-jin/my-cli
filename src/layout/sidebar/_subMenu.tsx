import { defineAsyncComponent, defineComponent } from 'vue'
import type { DefineComponent } from 'vue'
// const SubMenu: JSX.Element = defineAsyncComponent(() => import('./subMenu.tsx'))

const _subMenu: JSX.Element = defineComponent({
  props: {
    subIndex: {
      type: Number,
    },
    subIcon: {
      type: Function,
      default: null
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
      $props: {
        subIndex,
        subIcon = null,
        subTitle,
        childMenu
      }
    } = this
    console.table(this.$props)
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
        { childMenu.length !== 0 && childMenu.map((childMenu, childIndex) => {
          return childMenu.isGroup
            ? <>1</>
            : <_subMenu
              subIcon={ childMenu.icon }
              subTitle={ childMenu.title }
              subIndex={ Number(`${ subIndex }.${ childIndex + 1 }`) }
              childMenu={ childMenu.childMenu }
            />
        }) }
      </el-sub-menu>
    </>

  }
})

export default _subMenu