<template>
  <el-form class="login-content-form">
    <el-form-item class="login-animation-one">
      <el-input
        v-model="ruleForm.username"
        type="text"
        :placeholder="$t('message.account.accountPlaceholder1')"
        clearable
        autocomplete="off"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><elementUser /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation-two">
      <el-input
        v-model="ruleForm.password"
        :type="isShowPassword ? 'text' : 'password'"
        :placeholder="$t('message.account.accountPlaceholder2')"
        autocomplete="off"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><elementUnlock /></el-icon>
        </template>
        <template #suffix>
          <i
            class="iconfont el-input__icon login-content-password"
            :class="isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
            @click="isShowPassword = !isShowPassword"
          >
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation-three">
      <el-row :gutter="15">
        <el-col :span="16">
          <el-input
            v-model="ruleForm.captcha"
            type="text"
            maxlength="4"
            :placeholder="$t('message.account.accountPlaceholder3')"
            clearable
            autocomplete="off"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><elementPosition /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-content-code">
            <span class="login-content-code-img">1234</span>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item class="login-animation-four">
      <el-button type="primary" class="login-content-submit" round :loading="loading.signIn" @click="onSignIn">
        <span>{{ $t('message.account.accountBtnText') }}</span>
      </el-button>
    </el-form-item>
    <el-form-item class="login-animation-five">
      <el-button type="text" size="small">{{ $t('message.link.one3') }}</el-button>
      <el-button type="text" size="small">{{ $t('message.link.two4') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
  import { toRefs, reactive, defineComponent, computed, getCurrentInstance, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { initFrontEndControlRoutes } from '@/router/frontEnd'
  import { initBackEndControlRoutes } from '@/router/backEnd'
  import { useStore } from '@/store/index'
  import { Session } from '@/utils/storage'
  import { formatAxis } from '@/utils/formatTime'

  import { signIn } from '@/api/login'

  export default defineComponent({
    name: 'LoginAccount',
    setup() {
      const { t } = useI18n()
      const { proxy } = getCurrentInstance() as any
      const store = useStore()
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

      // 时间获取
      const currentTime = computed(() => {
        return formatAxis(new Date())
      })
      // 登录
      const onSignIn = async () => {
        state.loading.signIn = true

        signIn(state.ruleForm)
          .then(async res => {
            Session.set('token', JSON.stringify(res))
            // 1、请注意执行顺序(存储用户信息到vuex)
            await store.dispatch('userInfos/setUserInfos', res)
            if (!store.state.themeConfig.themeConfig.isRequestRoutes) {
              // 前端控制路由，2、请注意执行顺序
              await initFrontEndControlRoutes()
              signInSuccess()
            } else {
              // 模拟后端控制路由，添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
              await initBackEndControlRoutes()
              signInSuccess()
            }
          })
          .catch(err => {
            return false
          })
          .finally(() => {
            state.loading.signIn = false
          })
      }
      // 登录成功后的跳转
      const signInSuccess = () => {
        // 初始化登录成功时间问候语
        let currentTimeInfo = currentTime.value
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
        ...toRefs(state)
      }
    }
  })
</script>

<style scoped lang="scss">
  .login-content-form {
    margin-top: 20px;
    .login-animation-one,
    .login-animation-two,
    .login-animation-three,
    .login-animation-four,
    .login-animation-five {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    .login-animation-one {
      animation-delay: 0.1s;
    }
    .login-animation-two {
      animation-delay: 0.2s;
    }
    .login-animation-three {
      animation-delay: 0.3s;
    }
    .login-animation-four {
      animation-delay: 0.4s;
      margin-bottom: 5px;
    }
    .login-animation-five {
      animation-delay: 0.5s;
    }
    .login-content-password {
      display: inline-block;
      width: 25px;
      cursor: pointer;
      &:hover {
        color: #909399;
      }
    }
    .login-content-code {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .login-content-code-img {
        width: 100%;
        height: 40px;
        line-height: 40px;
        background-color: #ffffff;
        border: 1px solid rgb(220, 223, 230);
        color: #333;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 5px;
        /*text-indent: 5px;*/
        text-align: center;
        cursor: pointer;
        transition: all ease 0.2s;
        border-radius: 4px;
        user-select: none;
        &:hover {
          border-color: #c0c4cc;
          transition: all ease 0.2s;
        }
      }
    }
    .login-content-submit {
      width: 100%;
      letter-spacing: 2px;
      font-weight: 300;
      margin-top: 15px;
    }
  }
</style>
