import { createApp } from 'vue'
import store, { useStore } from './store'
import App from './App.tsx'
import router from '@/router'
import { installPlugins } from '@/utils/init'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/theme/index.less'
import { directive } from '@/directive'

// const themeStore = ThemeStore()

installPlugins()

const app = createApp(App)

app.use(store)
app.use(router)
// app.use(ElementPlus)
app.use(ElementPlus, { size: useStore().useThemeStore.themeConfig.globalComponentSize })
// app.use(ElementPlus, { size: themeStore.themeConfig.globalComponentSize })
// app.use(ElementPlus, { size: '' })

directive(app) // 依赖于store
// installElSvg(app) // 依赖elementPlus

app.mount('#app')