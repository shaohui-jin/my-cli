import { createApp } from 'vue'
import store from './store'
import App from './App.tsx'
import router from '@/router'
import { installPlugins, installElSvg } from '@/utils/init'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/theme/index.less'
import { directive } from '@/directive'

installPlugins()

const app = createApp(App)

app.use(store)
app.use(ElementPlus)
app.use(router)

directive(app) // 依赖于store
installElSvg(app) // 依赖elementPlus

app.mount('#app')
