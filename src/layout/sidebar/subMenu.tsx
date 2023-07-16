import { defineComponent } from 'vue'
// import SubMenu from './SubMenu.tsx'
export default defineComponent({
  setup() {
    console.log(123123)
  },
  render() {
    const { $props: { subMenu, subIndex, subIcon, subTitle } } = this
    console.log(subMenu, subIndex, subIcon, subTitle)
    return <>
      <el-sub-menu
        index={ subIndex }
        v-slots={ {
          title: () => {
            return <>
              {/*{ subIcon ? <el-icon>{ subIcon }</el-icon> : <></> }*/}
              <span>{ subTitle }</span>
            </>
          }
        } }
      >
        { subMenu.childMenu.map((childMenu, childIndex) => {
          return <>
            childMenu.isGroup
            ? <>1</> : <>2</>
            {/*: <SubMenu {...childMenu} subIndex={`${subIndex}-${childIndex}`} />*/}
          </>
        }) }
      </el-sub-menu>
    </>

  }
})
