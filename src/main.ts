import { createApp } from 'vue'
import store from './store'
import App from './App.tsx'
import router from '@/router'
import { install } from '@/plugins'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { directive } from '@/directive'

install()

const app = createApp(App)

app.use(store)

directive(app) // 依赖于store

app.use(ElementPlus).use(router).mount('#app')
