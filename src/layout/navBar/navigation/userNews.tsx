import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const newsList = ref<{ [T: string]: string }[]>([
      {
        label: '关于版本发布的通知',
        value: 'my-visual-screen，基于 vue3 + CompositionAPI + typescript + vite + element plus，正式发布时间：待定！',
        time: '2023-09-22'
      },
      {
        label: '关于学习交流的通知',
        value: 'QQ群号码 xxxx，欢迎小伙伴入群学习交流探讨！',
        time: '2023-09-22'
      }
    ])

    /**
     * @desc 全部已读点击
     */
    const onAllReadClick = () => {
      newsList.value = []
    }
    // 前往通知中心点击
    const onGoToGihubClick = () => {
      window.open('https://github.com/shaohui-jin/shaohui-jin.github.io')
    }
    return { newsList, onAllReadClick, onGoToGihubClick }
  },
  render() {
    const { newsList, onAllReadClick, onGoToGihubClick } = this
    return (
      <>
        <div class="layout-navbar-breadcrumb-user-news">
          <div class="head-box">
            <div class="head-box-title">通知</div>
            {newsList.length > 0 && (
              <div class="head-box-btn" onClick={onAllReadClick}>
                全部已读
              </div>
            )}
          </div>
          <div class="content-box">
            {newsList.length > 0 ? (
              newsList.map(v => {
                return (
                  <>
                    <div class="content-box-item">
                      <div>{v.label}</div>
                      <div class="content-box-msg">{v.value}</div>
                      <div class="content-box-time">{v.time}</div>
                    </div>
                  </>
                )
              })
            ) : (
              <el-empty description="暂无通知" />
            )}
          </div>
          {newsList.length > 0 && (
            <div class="foot-box" onClick={onGoToGihubClick}>
              前往通知中心
            </div>
          )}
        </div>
      </>
    )
  }
})
