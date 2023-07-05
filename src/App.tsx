import { ref, defineAsyncComponent } from 'vue'

import '@/hooks/usePage/demo.ts'
import style from './App.module.less'
// import DefineCompDemo from './components/defineCompDemo'
// import FunctionalCompDemo from './components/functionalCompDemo'
const DefineCompDemo = defineAsyncComponent(() => import('./components/defineCompDemo'))
const FunctionalCompDemo = defineAsyncComponent(() => import('./components/functionalCompDemo'))


export default {
  setup() {
    let msg = ref<number>(1)
    const onFun = {
      'update:msg': (val) => {
        console.log(123123, val)
        msg.value = val
      },
      '!click': () => {
        // .capture 的事件
      },
      '~keyup': () => {
        // .once 的事件
      },
      '~!mouseover': () => {
        // .capture.once或.once.capture 的事件
      }
    }
    let defineCompDemoMsg = ref('DefineCompDemo')
    let functionalCompDemoMsg = ref('FunctionalCompDemo')
    const childrenSlot = {
      default: () => {
        return <p>父组件插入内容至子组件：默认插槽</p>
      },
      common: () => {
        return <p>父组件插入内容至子组件：具名插槽</p>
      },
    }
    return {
      defineCompDemoMsg,
      functionalCompDemoMsg,
      childrenSlot
    }
    // return () => {
    //   return <>
    //     <div className={style.app}>
    //       <a href="https://vitejs.dev" target="_blank">
    //         <img src="/vite.svg" className="logo" alt="Vite logo"/>
    //       </a>
    //       <a href="https://vuejs.org/" target="_blank">
    //         <img src="./assets/vue.svg" className="logo vue" alt="Vue logo"/>
    //       </a>
    //       <DefineCompDemo v-model:msg={defineCompDemoMsg.value} v-slots={childrenSlot} />
    //       {/*<DefineCompDemo v-model={[defineCompDemoMsg.value,'msg']} v-slots={childrenSlot} />*/}
    //       <br />
    //       <FunctionalCompDemo v-model={[functionalCompDemoMsg.value,'msg']} v-slots={childrenSlot}/>
    //     </div>
    //   </>
    // }
  },
  render() {
    return <>
      <div className={style.app}>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo"/>
        </a>
        <a href="https://vuejs.org/" target="_blank">
          <img src="./assets/vue.svg" className="logo vue" alt="Vue logo"/>
        </a>
        <DefineCompDemo v-model={[this.defineCompDemoMsg,'msg']} v-slots={this.childrenSlot} />
        {/*<DefineCompDemo v-model:msg={this.defineCompDemoMsg} v-slots={this.childrenSlot} />*/}
        <FunctionalCompDemo v-model={[this.functionalCompDemoMsg,'msg']} v-slots={this.childrenSlot} />
      </div>
    </>
  }
}
