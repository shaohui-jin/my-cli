import { createApp } from 'vue'
import store, { useStore } from './store'
import App from './App.tsx'
import router from '@/router'
import { installElSvg, installPlugins } from '@/utils/init'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/theme/index.less'
import mitt from 'mitt'
import { directive } from '@/directive'

installPlugins()

const app = createApp(App)

app.use(store)
app.use(router)
// app.use(ElementPlus)
app.use(ElementPlus, { size: useStore().useThemeStore.globalComponentSize })

app.mount('#app')

app.config.globalProperties.mittBus = mitt()

directive(app) // 依赖于store
installElSvg(app)