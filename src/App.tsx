
import HelloWorld from './components/HelloWorld'
import { ref } from 'vue'
const msg = ref<number>(1)
import '@/hooks/usePage/demo.ts'

export default {
  setup() {
    return () => {
      return <>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo" alt="Vite logo"/>
          </a>
          <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" className="logo vue" alt="Vue logo"/>
          </a>
        </div>
        <HelloWorld v-model={[msg, ]} />
      </>
    }
  }
}
