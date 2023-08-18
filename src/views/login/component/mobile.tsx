import { toRefs, reactive, defineComponent } from 'vue'
import { Position } from  '@element-plus/icons-vue'
import './mobile.less'

export default defineComponent({
  setup() {
    const state = reactive({
      ruleForm: {
        username: '',
        code: ''
      }
    })
    return {
      ...toRefs(state)
    }
  },
  render() {
    const { ruleForm } = this
    return (
      <>
        <el-form class="login-content-form">
          <el-form-item class="login-animation-one">
            <el-input
              type="text"
              placeholder="请输入手机号"
              v-model={ruleForm.username}
              clearable
              autocomplete="off"
              v-slots={{
                prefix: () => {
                  return <i class="iconfont icon-dianhua el-input__icon"></i>
                }
              }}
            />
          </el-form-item>
          <el-form-item class="login-animation-two">
            <el-row gutter={15}>
              <el-col span={16}>
                <el-input
                  type="text"
                  maxlength="4"
                  placeholder="请输入验证码"
                  v-model={ruleForm.code}
                  clearable
                  autocomplete="off"
                  v-slots={{
                    prefix: () => {
                      return (
                        <el-icon>
                          <Position />
                        </el-icon>
                      )
                    }
                  }}
                />
              </el-col>
              <el-col span={8}>
                <el-button class="login-content-code">获取验证码</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item class="login-animation-three">
            <el-button type="primary" class="login-content-submit" round>
              <span>登录</span>
            </el-button>
          </el-form-item>
          <el-form-item class="login-animation-four">
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
