import { computed, defineComponent, ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useStore } from '@/store'

export default defineComponent({
  setup() {
    const isDelayFooter = ref<boolean>(true)
    const msg = computed(() => {
      return `${useStore().useThemeStore.globalTitle}，Made by ${useStore().useThemeStore.globalViceTitle} with ❤️`
    })
    // 路由改变时，等主界面动画加载完毕再显示 footer
    onBeforeRouteUpdate(() => {
      isDelayFooter.value = false
      setTimeout(() => {
        isDelayFooter.value = true
      }, 800)
    })
    return { isDelayFooter, msg }
  },
  render() {
    const { isDelayFooter, msg } = this
    return (
      <>
        {isDelayFooter ? (
          <>
            <div class="layout-footer mt15">
              <div class="layout-footer-warp">
                <div>{msg}</div>
                <div class="mt5">123</div>
              </div>
            </div>
          </>
        ) : (
          <div></div>
        )}
      </>
    )
  }
})
