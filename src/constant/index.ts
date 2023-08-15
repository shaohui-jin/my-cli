export * from './modules/cookie.ts'
export * from './modules/theme.ts'
export * from './modules/router.ts'

// 不是很推荐这样写，会丢失提示
// const modulesFiles = import.meta.glob('./modules/**.ts')
//
// const modules: { [x: string]: any } = {}
//
// for (const path in modulesFiles) {
//   const module = path.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
//   modulesFiles[path]().then((res: any) => {
//     modules[module] = res.default
//   })
// }
//