import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import { ThemeStore } from './modules/theme.ts'
import { UserStore } from './modules/user.ts'

const store = createPinia().use(piniaPluginPersist)

export const useStore = () => ({
  useThemeStore: ThemeStore(),
  useUserStore: UserStore()
})

export default store
