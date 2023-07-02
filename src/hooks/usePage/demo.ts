import {reactive, ref, computed} from 'vue'
import {usePage} from '../usePage'

// 查询参数
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


// 首次获取数据使用 reset方式即可 tableData 的数据自动更新
// reset()