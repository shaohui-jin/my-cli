import AdvancedConsole from './console.ts'
import { setCssCdn, setJsCdn } from './externalResources.ts'
import * as svg from '@element-plus/icons-vue'

export const installPlugins = () => {
  window.App = Object.freeze({
    $console: AdvancedConsole
  })
}

/**
 * 导出全局注册 element plus svg 图标
 * @param app vue 实例
 * @description 使用：https://element-plus.gitee.io/zh-CN/component/icon.html
 */
export function installElSvg(app: App) {
  const icons = svg as any
  for (const i in icons) {
    app.component(`Element${icons[i].name}`, icons[i])
  }
  // app.component('SvgIcon', SvgIcon)
}

/**
 * 批量设置字体图标、动态js
 * @method cssCdn 动态批量设置字体图标
 * @method jsCdn 动态批量设置第三方js
 */
export const setExternalResources = {
  // 设置css
  cssCdn: () => {
    setCssCdn()
  },
  // 设置js
  jsCdn: () => {
    setJsCdn()
  }
}
