import { reactive, ref, defineComponent, getCurrentInstance } from 'vue'
import usePage from '@/hooks/usePage'
import { Events } from 'vue'
import styles from '@/components/demo/demo.module.less'
export default defineComponent({
  setup(props, { slots, emit }) {
    const {
      appContext: {
        config: { globalProperties: global }
      }
    } = getCurrentInstance()
    global.$console.info('SLAThemeSetting 组件渲染，组件类型 defineComponent')

    const searchForm = reactive({
      createEndTime: '',
      createStartTime: ''
    })

    // 接收 查询参数、获取列表的接口 返回 列表所需要的数据、分页参数、分页函数等
    const { reset, page, tableData, handleSizeChange, handleCurrentChange, query } = usePage({
      searchForm,
      getListApi: () =>
        new Promise(resolve => {
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
    })

    // const handleButton: Events = () => {
    //   count.value++
    //   emit('update:msg', `${props.msg}${count.value}`)
    // };
    return { query }
  },
  render() {
    const { query } = this
    return (
      <div className={styles.usePage}>
        <div className={styles.usePage__left}>
          <span>这是usePage组件</span>
        </div>
        <div className={styles.usePage__right}>
          <button type="button" onClick={query}>
            点击查询
          </button>
        </div>
      </div>
    )
  }
})
