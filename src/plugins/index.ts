// const installPlugins = () => {
//   const plugins: Record<string, Function> = import.meta.glob('./plugins/**.ts')
//   for (const key in plugins) {
//     plugins[key]()
//   }
// }
import AdvancedConsole from './modules/console'

const mountData = () => {
  window.App = Object.freeze({
    $console: AdvancedConsole
  })
}

export const install = () => {
  // installPlugins()
  mountData()
}
