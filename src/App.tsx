import { ref, defineAsyncComponent } from 'vue'

import '@/hooks/usePage/demo.ts'
import style from './App.module.less'
// import DefineCompDemo from './components/defineCompDemo'
const DefineCompDemo = defineAsyncComponent(() => import('./components/defineCompDemo'))
import FunctionalCompDemo from './components/functionalCompDemo'

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
    return () => {
      return <>
        <div className={style.app}>
          <a href="https://vitejs.dev" target="_blank">
              <img src="/vite.svg" className="logo" alt="Vite logo"/>
          </a>
          <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" className="logo vue" alt="Vue logo"/>
          </a>
          <DefineCompDemo msg={'DefineCompDemo'} on={onFun} />
        </div>
      </>
    }
  }
}
