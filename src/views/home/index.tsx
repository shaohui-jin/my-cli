import { defineComponent } from 'vue'

import './home.less'
import vueImg from '@/assets/vue.svg'

export default defineComponent({
  setup() {
    const onFun = {
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
    return { onFun, vueImg }
  },
  render() {
    return (
      <div class="home">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
          <img src={vueImg} class="logo vue" alt="Vue logo" />
        </a>
      </div>
    )
  }
})
