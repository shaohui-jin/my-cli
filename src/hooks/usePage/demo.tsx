import {reactive, ref, defineComponent, getCurrentInstance} from 'vue'
import usePage from '../usePage'
import {Events} from "@vue/runtime-dom";
export default defineComponent({
  setup(props, { slots, emit }) {
    const { appContext : { config: { globalProperties: global } } } = getCurrentInstance()
    global.$console.info('渲染了defineComponent组件: usePageDemo')

    const searchForm = reactive({
      createEndTime: '',
      createStartTime: ''
    })

    // 接收 查询参数、获取列表的接口 返回 列表所需要的数据、分页参数、分页函数等
    const {reset, page, tableData, handleSizeChange, handleCurrentChange} = usePage({
      searchForm,
      getListApi: () => new Promise(resolve => {
        resolve({
          code: 0,
          data: {
            rows: [
              {name: '11', job: 'xxx'},
              {name: '22', job: 'yyy'},
            ]
          }
        })
      })
    })

    // const handleButton: Events = () => {
    //   count.value++
    //   emit('update:msg', `${props.msg}${count.value}`)
    // };
    // return { slots, props, count, handleButton }
  },
  render() {
    const { slots, props, count, handleButton } = this
    return  (
      <div>
        {slots?.default && slots.default()}
        <h2>这个是外部传入的： {props.msg}</h2>
        {slots?.common && slots.common()}
        <h2>这是内部的： {count}</h2>
        <button type="button" onClick={handleButton}>点击增加</button>
      </div>
    )
  }
});
