import { createApp } from 'vue'
import store from './store'
import App from './App.tsx'
import router from '@/router'
import { install } from '@/plugins'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { directive } from '@/directive'
// import Utils from '@/utils'

install()

const app = createApp(App)

app.use(store)

// console.log(Utils)
directive(app) // 依赖于store

app.use(ElementPlus).use(router).mount('#app')
