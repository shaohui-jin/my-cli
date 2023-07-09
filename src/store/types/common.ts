// 定义 StoreState 接口
interface StoreState {
  // 定义 ResType 类型为你的特定类
  ResType: YourResTypeClass;
  // 其他状态属性...
}
// 创建 Vuex store
export default createStore<StoreState>({
  // state、mutations、actions 等内容...
});