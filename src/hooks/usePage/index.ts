import { reactive, ref, getCurrentInstance, FunctionalComponent, CSSProperties } from 'vue'
import { ComponentInternalInstance } from 'vue'

// 一个用于重置对象字段为原始值的函数
const resetObjToPrimitiveType = (searchForm: {}): Object => searchForm

interface Props {
  // 默认查询参数
  searchForm: Object
  // 获取列表数据的接口
  getListApi: (params: any) => Promise<any>
  // 自定义查询参数
  customQueryParameters: () => Object
  // 执行完 getList 成功后执行的逻辑 有一个opts参数
  getListFunc: (options: Props) => void
  // 执行完 reset 后执行的逻辑
  resetFunc: () => void
  // 执行完 sizeChange 后执行的逻辑
  sizeChangeFunc: () => void
  // 执行完 currentChange 后执行的逻辑
  currentChangeFunc: () => void
  style: CSSProperties
}

type Emit = {}

const usePage: FunctionalComponent<Props, Emit> = props => {
  // searchForm 由外部传入，内部传入导出的数据无法推导类型即无法知道对象里有什么也会失去代码提示
  const {
    searchForm,
    getListApi,
    customQueryParameters = () => ({}),
    getListFunc = () => {},
    resetFunc,
    sizeChangeFunc = () => {},
    currentChangeFunc = () => {}
  } = props as Props

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

    getListApi(opts).then(res => {
      if (res.code === 0) {
        tableData.value = res.data?.rows || []
        page.total = res.data?.total || 0
        getListFunc(props)
      }
    })
  }
  getList()
  const handleSizeChange = (size: number) => {
    page.pageSize = size
    sizeChangeFunc()
    getList()
  }

  const handleCurrentChange = (cur: number) => {
    page.pageNo = cur
    currentChangeFunc()
    getList()
  }

  const query = () => {
    getList()
    window.App.$console.info('调用了getList')
  }
  return {
    searchForm,
    reset,
    page,
    tableData,
    handleSizeChange,
    handleCurrentChange,
    query
  }
}

export default usePage
