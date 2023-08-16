import { defineComponent } from 'vue'
import { toRefs, reactive, computed } from 'vue'
import Account from '@/views/login/component/account.vue'
import Mobile from '@/views/login/component/mobile.vue'
import Scan from '@/views/login/component/scan.vue'
import { ThemeStore, ThemeType } from '@/store/modules/theme.ts'
import './login.less'

export default defineComponent({
  setup() {
    const themeStore = ThemeStore()
    const themeConfig: ThemeType = themeStore.themeConfig
    const state = reactive({
      tabsActiveName: 'account',
      isTabPaneShow: true,
      isScan: true
    })
    const handleScan = () => {
      state.isScan = !state.isScan
    }
    return {
      themeConfig,
      handleScan,
      ...toRefs(state)
    }
  },
  render() {
    const { themeConfig, handleScan, tabsActiveName, isScan } = this
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
                  <el-tabs v-model={tabsActiveName}>
                    <el-tab-pane label="后台管理系统" name="account">
                      {/*<Account />*/}
                    </el-tab-pane>
                    <el-tab-pane label="后台管理系统" name="mobile">
                      {/*<Mobile />*/}
                    </el-tab-pane>
                  </el-tabs>
                </>
              )}
              <div class="login-content-main-sacn" onClick={handleScan}>
                {isScan ? <ElementFullScreen size={'20px'} /> : <ElementPlatform />}
                {/*<i class={['iconfont', isScan ? 'icon-diannao1' : 'icon-barcode-qr']}></i>*/}
                <div class="login-content-main-sacn-delta"></div>
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
