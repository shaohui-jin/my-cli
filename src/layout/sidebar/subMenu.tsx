import { CSSProperties, defineAsyncComponent, defineComponent, FunctionalComponent } from 'vue'
import type { DefineComponent } from 'vue'

// const SubMenu: JSX.Element = defineAsyncComponent(() => import('./subMenu.tsx'))

interface Props {
  subIndex: Number;
  subIcon: Function;
  subTitle: String;
  childMenu: Array;
}

type Emit = {
  'update:msg': (msg: string) => void
}
const SubMenu: FunctionalComponent<Props, Emit> = (props) => {
  const {
    subIndex,
    subIcon = null,
    subTitle,
    childMenu
  } = props
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
          : <SubMenu
            subIcon={ childMenu.icon }
            subTitle={ childMenu.title }
            subIndex={ Number(`${ subIndex }.${ childIndex + 1 }`) }
            childMenu={ childMenu.childMenu }
          />
      }) }
    </el-sub-menu>
  </>

}

export default SubMenu