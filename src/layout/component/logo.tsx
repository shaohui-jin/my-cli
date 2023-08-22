import { computed, getCurrentInstance, defineComponent } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any
    // 获取布局配置信息
    const globalTitle = computed(() => useStore().useThemeStore.globalTitle)
    // 设置 logo 的显示。classic 经典布局默认显示 logo
    const setShowLogo = computed(() => {
      const { isCollapse, layout } = useStore().useThemeStore
      return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000
    })
    // logo 点击实现菜单展开/收起
    const onThemeConfigChange = () => {
      if (useStore().useThemeStore.layout === 'transverse') return false
      proxy.mittBus.emit('onMenuClick')
      useStore().useThemeStore.isCollapse = !useStore().useThemeStore.isCollapse
    }
    return {
      setShowLogo,
      globalTitle,
      onThemeConfigChange
    }
  },
  render() {
    const { onThemeConfigChange, setShowLogo, globalTitle } = this
    return (
      <>
        {setShowLogo ? (
          <>
            <div class="layout-logo" onClick={onThemeConfigChange}>
              <img
                src="https://gitee.com/lyt-top/vue-next-admin-images/raw/master/logo/logo-mini.svg"
                class="layout-logo-medium-img"
              />
              <span>{{ globalTitle }}</span>
            </div>
          </>
        ) : (
          <>
            <div class="layout-logo-size" onClick={onThemeConfigChange}>
              <img
                src="https://gitee.com/lyt-top/vue-next-admin-images/raw/master/logo/logo-mini.svg"
                class="layout-logo-size-img"
              />
            </div>
          </>
        )}
      </>
    )
  }
})
