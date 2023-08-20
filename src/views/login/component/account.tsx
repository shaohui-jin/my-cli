import { toRefs, reactive, defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import './account.less'
import { formatAxis } from '@/utils/time.ts'
import { Position, User, Unlock } from '@element-plus/icons-vue'
import UserApi from '@/api/modules/user.ts'
import { useStore } from '@/store'
import { initFrontEndRoutes } from '@/router/frontEnd.ts'

export default defineComponent({
  setup() {
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

      UserApi.login(state.ruleForm)
        .then(async res => {
          window.App.$console.info('登录成功', res)
          if (!useStore().useThemeStore.isRequestRoutes) {
            await initFrontEndRoutes()
            signInSuccess()
          } else {
            // /模拟后端控制路由，添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
            // await initBackEndRoutes()
            signInSuccess()
          }
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
      const path: string = ((route as any).query.redirect as string) || '/'
      const query: any = JSON.parse((route as any).query.params || '{}')
      router.push({ path, query })

      // 登录成功提示
      setTimeout(() => {
        // 关闭 loading
        state.loading.signIn = true
        ElMessage.success(`${currentTimeInfo}，欢迎回来`)
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
    const { ruleForm, isShowPassword, loading, handleShowPassword, onSignIn } = this
    return (
      <>
        <el-form class="login-content-form">
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
