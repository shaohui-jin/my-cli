import { createApp } from 'vue'
import store from './store'
import './style.css'
import App from './App.tsx'
import { install } from './common'


install()

const app = createApp(App)
app.config.globalProperties.$console = window.App.console

app.use(store).mount('#app')

