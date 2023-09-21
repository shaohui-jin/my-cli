import { defineComponent, getCurrentInstance, computed } from 'vue'
import { useStore } from '@/store'
import userLogo from '@/assets/images/ms-icon-144.png'
export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any
    // 获取布局配置信息
    const globalTitle = computed(() => useStore().useThemeStore.globalTitle)
    // 设置 logo 的显示。classic 经典布局默认显示 logo
    const showLogo = computed(() => {
      const { isCollapse, layout } = useStore().useThemeStore
      return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000
    })
    // logo 点击实现菜单展开/收起
    const onThemeConfigChange = () => {
      if (useStore().useThemeStore.layout === 'transverse') return false
      proxy.mittBus.emit('onMenuClick')
      useStore().useThemeStore.isCollapse = !useStore().useThemeStore.isCollapse
    }
    return { showLogo, globalTitle, onThemeConfigChange }
  },
  render() {
    return (
      <>
        {this.showLogo ? (
          <>
            <div class="layout-logo" onClick={this.onThemeConfigChange}>
              <img src={userLogo} class="layout-logo-medium-img" />
              <span>{this.globalTitle}</span>
            </div>
          </>
        ) : (
          <>
            <div class="layout-logo-size" onClick={this.onThemeConfigChange}>
              <img src={userLogo} class="layout-logo-size-img" />
            </div>
          </>
        )}
      </>
    )
  }
})
