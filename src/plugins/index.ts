// const installPlugins = () => {
//   const plugins: Record<string, Function> = import.meta.glob('./plugins/**.ts')
//   for (const key in plugins) {
//     plugins[key]()
//   }
// }
import AdvancedConsole from './modules/console'
import Utils from './modules/utils'

const mountData = () => {
  window.App = Object.freeze({
    $console: AdvancedConsole,
    $utils: Utils
  })
}

export const install = () => {
  // installPlugins()
  mountData()
}
