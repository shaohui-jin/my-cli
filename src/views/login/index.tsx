import { defineAsyncComponent, defineComponent } from 'vue'
import { toRefs, reactive, ref } from 'vue'
import { useStore } from '@/store'
import './login.less'

const Mobile = defineAsyncComponent(() => import('@/views/login/component/mobile.tsx'))
const Scan = defineAsyncComponent(() => import('@/views/login/component/scan.vue'))
const Account = defineAsyncComponent(() => import('@/views/login/component/account.tsx'))

export default defineComponent({
  setup() {
    const { globalViceTitle } = useStore().useThemeStore
    const state = reactive({
      tabsActiveName: 'account',
      isTabPaneShow: true,
      isScan: false
    })
    const tabsActiveName = ref<string>('account')
    const handleScan = () => {
      state.isScan = !state.isScan
    }
    return {
      globalViceTitle,
      handleScan,
      ...toRefs(state),
      tabsActiveName
    }
  },
  render() {
    const { globalViceTitle, handleScan, isScan } = this
    return (
      <>
        <div class="login-container">
          <div class="login-logo">
            <span>{globalViceTitle}</span>
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
                    <el-tab-pane label="帐号密码登录" name="account">
                      <Account />
                    </el-tab-pane>
                    <el-tab-pane label="手机号登录" name="mobile">
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
          <div class="login-copyright">
            <div class="m-b-5 login-copyright-company">Copyright: JSH XXX Software Technology Co., Ltd</div>
            <div class="login-copyright-msg">
              Copyright: JSH XXX software technology Guangdong ICP preparation no.05010000
            </div>
          </div>
        </div>
      </>
    )
  }
})
