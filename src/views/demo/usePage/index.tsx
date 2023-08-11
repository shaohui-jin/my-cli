import { reactive, defineComponent } from 'vue'
import usePage from '@/hooks/usePage'

export default defineComponent({
  setup() {
    window.App.$console.info('SLAThemeSetting 组件渲染，组件类型 defineComponent')

    const searchForm = reactive({
      createEndTime: '',
      createStartTime: ''
    })

    // 接收 查询参数、获取列表的接口 返回 列表所需要的数据、分页参数、分页函数等
    const { query } = usePage({
      searchForm,
      getListApi: () => {
        return new Promise(resolve => {
          resolve({
            code: 0,
            data: {
              rows: [
                { name: '11', job: 'xxx' },
                { name: '22', job: 'yyy' }
              ]
            }
          })
        })
      }
    })

    return { query }
  },
  render() {
    const { query } = this
    return (
      <div class="flex-center flex-d-c">
        <span class="m-b-20">F12查看控制台</span>
        <button type="button" onClick={query}>
          点击查询
        </button>
      </div>
    )
  }
})
