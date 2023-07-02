import {reactive, ref} from 'vue'

// 一个用于重置对象字段为原始值的函数
const resetObjToPrimitiveType = (searchForm: {}) => {}

/**
 * @description usePage 接收一个 opts 参数，返回列表所需数据
 * @param {Object} opts.searchForm - 默认查询参数
 * @param {Function} opts.getListApi  - 获取列表数据的接口
 * @param {Function} opts.customQueryParameters  - 自定义查询参数
 * @param {Function} opts.getListFunc  - 执行完 getList 成功后执行的逻辑 有一个opts参数
 * @param {Function} opts.resetFunc  - 执行完 reset 后执行的逻辑
 * @param {Function} opts.sizeChangeFunc  - 执行完 sizeChange 后执行的逻辑
 * @param {Function} opts.currentChangeFunc  - 执行完 currentChange 后执行的逻辑
 */
export const usePage = (opts) => {
  // searchForm 由外部传入，内部传入导出的数据无法推导类型即无法知道对象里有什么也会失去代码提示
  const {
    searchForm = {},
    getListApi,
    customQueryParameters = () => {},
    getListFunc = (opts) => {},
    resetFunc = () => {},
    sizeChangeFunc = () => {},
    currentChangeFunc = () => {}
  } = opts

  const reset = () => {
    Object.assign(searchForm, resetObjToPrimitiveType(searchForm))
    resetFunc()
    handleCurrentChange(1)
  }

  const page = reactive({
    pageSize: 10,
    pageNo: 1,
    total: 0
  })

  const tableData = ref([])
  const getList = () => {
    const opts = {
      ...page,
      ...searchForm,
      ...customQueryParameters()
    }

    getListApi(opts).then((res) => {
      if (res.code === 0) {
        tableData.value = res.data?.rows || []
        page.total = res.data?.total || 0
        console.log(JSON.stringify(tableData.value))
        getListFunc(opts)
      }
    })
  }
  getList()
  const handleSizeChange = (size) => {
    page.pageSize = size
    sizeChangeFunc()
    getList()
  }

  const handleCurrentChange = (cur) => {
    page.pageNo = cur
    currentChangeFunc()
    getList()
  }

  return {
    searchForm,
    reset,
    page,
    tableData,
    handleSizeChange,
    handleCurrentChange
  }
}