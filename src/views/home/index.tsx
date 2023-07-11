import { ref, defineAsyncComponent } from 'vue'

import style from './home.module.less'
// import DefineCompDemo from './components/defineCompDemo'
// import FunctionalCompDemo from './components/functionalCompDemo'
const UsePageDemo = defineAsyncComponent(() => import('@/hooks/usePage/demo'))
const DefineCompDemo = defineAsyncComponent(() => import('@/components/demo/defineComp.tsx'))
const FunctionalCompDemo = defineAsyncComponent(() => import('@/components/demo/functionalComp.tsx'))
import vueImg from '@/assets/vue.svg'
export default {
  setup() {
    let msg = ref<number>(1)
    const onFun = {
      'update:msg': (val) => {
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
        return <p>default 默认插槽</p>
      },
      common: () => {
        return <p>common 具名插槽</p>
      },
    }
    return {
      vueImg,
      defineCompDemoMsg,
      functionalCompDemoMsg,
      childrenSlot
    }
  },
  render() {
    return <div className={style.home}>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" className={style.logo} alt="Vite logo"/>
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src={vueImg} className={`${style.logo} ${style.vue}`} alt="Vue logo"/>
      </a>
      <UsePageDemo />
      <DefineCompDemo v-model={[this.defineCompDemoMsg,'msg']} v-slots={this.childrenSlot} />
      {/*<DefineCompDemo v-model:msg={this.defineCompDemoMsg} v-slots={this.childrenSlot} />*/}
      <FunctionalCompDemo msg={this.functionalCompDemoMsg} v-slots={this.childrenSlot}  style={{}}/>
    </div>
  }
}
