import { defineAsyncComponent, defineComponent } from 'vue'
import { toRefs, reactive, ref } from 'vue'
import { ThemeStore, ThemeType } from '@/store/modules/theme.ts'
import './login.less'

const Mobile = defineAsyncComponent(() => import('@/views/login/component/mobile.tsx'))
const Scan = defineAsyncComponent(() => import('@/views/login/component/scan.vue'))
const Account = defineAsyncComponent(() => import('@/views/login/component/account.tsx'))

export default defineComponent({
  setup() {
    const themeStore = ThemeStore()
    const themeConfig: ThemeType = themeStore.themeConfig
    const state = reactive({
      // tabsActiveName: 'account',
      isTabPaneShow: true,
      isScan: false
    })
    const tabsActiveName = ref<string>('account')
    const handleScan = () => {
      state.isScan = !state.isScan
    }
    return {
      themeConfig,
      handleScan,
      ...toRefs(state),
      tabsActiveName
    }
  },
  render() {
    const { themeConfig, handleScan, isScan } = this
    return (
      <>
        <div class="login-container">
          <div class="login-logo">
            <span>{themeConfig.globalViceTitle}</span>
          </div>
          <div class="login-content">
            <div class="login-content-main">
              <h4 class="login-content-title">后台管理系统</h4>
              {isScan ? (
                <>
                  <Scan />
                </>
              ) : (
                <>
                  <el-tabs v-model={this.tabsActiveName}>
                    <el-tab-pane label="后台管理系统" name="account">
                      <Account />
                    </el-tab-pane>
                    <el-tab-pane label="后台管理系统" name="mobile">
                      <Mobile />
                    </el-tab-pane>
                  </el-tabs>
                </>
              )}
              <div class="login-content-main-scan" onClick={handleScan}>
                <i class={['iconfont', isScan ? 'icon-diannao1' : 'icon-barcode-qr']}></i>
                <div class="login-content-main-scan-delta"></div>
              </div>
            </div>
          </div>
          {/*<div class="login-copyright">*/}
          {/*  <div class="mb5 login-copyright-company">{{ $t('message.copyright.one5') }}</div>*/}
          {/*  <div class="login-copyright-msg">{{ $t('message.copyright.two6') }}</div>*/}
          {/*</div>*/}
        </div>
      </>
    )
  }
})
