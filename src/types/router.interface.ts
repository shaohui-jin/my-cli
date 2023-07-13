export interface RouterConfig {
  name: string; // 名字
  text: string; // 文字提示
  import?: () => Promise<any>; // js文件
  routerPath: string; // 路径地址
}