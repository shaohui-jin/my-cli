import { toRefs, reactive, defineComponent, computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import './account.less'
import { formatAxis } from '@/utils/time.ts'
import { UserStore } from '@/store/modules/user.ts'
import { Position, User, Unlock } from '@element-plus/icons-vue'

const signIn = (obj: any) => {
  return new Promise(resolve => {
    resolve(JSON.stringify(obj))
  })
}
const initFrontEndControlRoutes = () => {}
const initBackEndControlRoutes = () => {}
export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any
    const userStore = UserStore()
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      isShowPassword: false,
      ruleForm: {
        username: '',
        password: '',
        captcha: ''
      },
      loading: {
        signIn: false
      }
    })
    const handleShowPassword = () => (state.isShowPassword = !state.isShowPassword)

    // 时间获取
    const currentTime = computed(() => formatAxis(new Date()))

    // 登录
    const onSignIn = async () => {
      state.loading.signIn = true

      signIn(state.ruleForm)
        .then(async res => {
          userStore
          console.log(userStore.user)
          userStore.$reset()
          console.log(userStore.user)
          // Session.set('token', JSON.stringify(res))
          // // 1、请注意执行顺序(存储用户信息到vuex)
          // await store.dispatch('userInfos/setUserInfos', res)
          // if (!store.state.themeConfig.themeConfig.isRequestRoutes) {
          //   // 前端控制路由，2、请注意执行顺序
          //   await initFrontEndControlRoutes()
          //   signInSuccess()
          // } else {
          //   // 模拟后端控制路由，添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
          //   await initBackEndControlRoutes()
          signInSuccess()
          // }
        })
        .catch(() => {
          return false
        })
        .finally(() => {
          state.loading.signIn = false
        })
    }
    // 登录成功后的跳转
    const signInSuccess = () => {
      // 初始化登录成功时间问候语
      const currentTimeInfo = currentTime.value
      // 登录成功，跳到转首页
      // 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
      // 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
      if (route.query?.redirect) {
        router.push({
          path: route.query?.redirect,
          query: Object.keys(route.query?.params).length > 0 ? JSON.parse(route.query?.params) : ''
        })
      } else {
        router.push('/')
      }
      // 登录成功提示
      setTimeout(() => {
        // 关闭 loading
        state.loading.signIn = true
        const signInText = t('message.signInText')
        ElMessage.success(`${currentTimeInfo}，${signInText}`)
        // 修复防止退出登录再进入界面时，需要刷新样式才生效的问题，初始化布局样式等(登录的时候触发，目前方案)
        proxy.mittBus.emit('onSignInClick')
      }, 300)
    }
    return {
      currentTime,
      onSignIn,
      handleShowPassword,
      ...toRefs(state)
    }
  },
  render() {
    const { ruleForm, isShowPassword, loading, currentTime, handleShowPassword, onSignIn } = this
    return (
      <>
        <el-form class="login-content-form-account">
          <el-form-item class="login-animation-one">
            <el-input
              v-model={ruleForm.username}
              type="text"
              placeholder="用户名 admin 或不输均为test"
              clearable
              autocomplete="off"
              v-slots={{
                prefix: () => (
                  <el-icon>
                    <User />
                  </el-icon>
                )
              }}
            />
          </el-form-item>
          <el-form-item class="login-animation-two">
            <el-input
              v-model={ruleForm.password}
              type={isShowPassword ? 'text' : 'password'}
              placeholder="密码 123456"
              autocomplete="off"
              v-slots={{
                prefix: () => (
                  <el-icon>
                    <Unlock />
                  </el-icon>
                ),
                suffix: () => (
                  <i
                    class={[
                      'iconfont',
                      'el-input__icon',
                      'login-content-password',
                      isShowPassword ? 'icon-xianshimima' : 'icon-yincangmima'
                    ]}
                    onClick={handleShowPassword}
                  />
                )
              }}
            />
          </el-form-item>
          <el-form-item class="login-animation-three">
            <el-row gutter={15}>
              <el-col span={16}>
                <el-input
                  v-model={ruleForm.captcha}
                  type="text"
                  maxlength="4"
                  placeholder="请输入验证码"
                  clearable
                  autocomplete="off"
                  v-slots={{
                    prefix: () => (
                      <el-icon>
                        <Position />
                      </el-icon>
                    )
                  }}
                ></el-input>
              </el-col>
              <el-col span={8}>
                <div class="login-content-code">
                  <span class="login-content-code-img">1234</span>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item class="login-animation-four">
            <el-button type="primary" class="login-content-submit" round loading={loading.signIn} onClick={onSignIn}>
              <span>登录</span>
            </el-button>
          </el-form-item>
          <el-form-item class="login-animation-five">
            <el-button text size="small">
              第三方登录
            </el-button>
            <el-button text size="small">
              友情链接
            </el-button>
          </el-form-item>
        </el-form>
      </>
    )
  }
})
