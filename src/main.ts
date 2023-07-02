import { createApp } from 'vue'
import store from './store'
import './style.css'
import App from './App.tsx'

createApp(App).use(store).mount('#app')

