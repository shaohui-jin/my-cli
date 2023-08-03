import { createApp } from 'vue'
import store from './store'
import App from './App.tsx'
import router from '@/router'
import { install } from '@/plugins'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

install()

const app = createApp(App)
app.config.globalProperties.$console = window.App.console

app.use(ElementPlus).use(router).use(store).mount('#app')
