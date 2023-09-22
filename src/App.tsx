import {
  defineComponent,
  onBeforeMount,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
  getCurrentInstance,
  ref,
  defineAsyncComponent
} from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { setExternalResources } from '@/utils/init'
import { useStore } from '@/store'

const Setting = defineAsyncComponent(() => import('@/layout/navBar/navigation/setting.tsx'))

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance()
    const settingRef = ref()
    const route = useRoute()
    const router = useRouter()
    const themeConfig = useStore().useThemeStore.themeConfig
    onBeforeMount(() => {
      // 设置批量第三方 icon 图标
      setExternalResources.cssCdn()
      // 设置批量第三方 js
      setExternalResources.jsCdn()
    })
    onMounted(() => {
      nextTick(() => {
        // 监听布局配置弹窗点击打开
        proxy.mittBus.on('openSettingDrawer', () => {
          settingRef.value.openDrawer()
        })
        // 设置 i18n，App.vue 中的 el-config-provider
        proxy.mittBus.on('getI18nConfig', (locale: string) => {
          state.i18nLocale = locale
        })
      })
    })
    onUnmounted(() => {
      proxy.mittBus.off('openSettingDrawer', () => {})
      proxy.mittBus.off('getI18nConfig', () => {})
    })

    /**
     * @desc 监听路由的变化，设置网站标题
     * @desc 设置浏览器标题国际化
     * @method const title = useTitle(); ==> title()
     */
    watch(
      () => route.path,
      () => {
        nextTick(() => {
          let webTitle = ''
          const globalTitle: string = useStore().useThemeStore.globalTitle
          webTitle = router.currentRoute.value.meta.title as any
          document.title = `${webTitle} - ${globalTitle}` || globalTitle
        })
      }
    )
    return { themeConfig }
  },
  render() {
    const { themeConfig} = this
    return (
      <>
        {/*<el-config-provider locale="zh-cn">*/}
        <RouterView />
        {/*<RouterView v-show={this.themeConfig.lockScreenTime !== 0} />*/}
        {/*{themeConfig.isLockScreen && <LockScreen />}*/}
        <Setting ref="settingRef" v-show="themeConfig.lockScreenTime !== 0" />
        {/*<CloseFull />*/}
        {/*</el-config-provider>*/}
      </>
    )
  }
})
