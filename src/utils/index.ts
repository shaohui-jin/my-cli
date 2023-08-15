const modulesFiles = import.meta.glob('./modules/**.ts')

const modulesList: string[] = []

for (const path in modulesFiles) {
  modulesList.push(path)
}

const Utils = modulesList.reduce(async (modules: { [x: string]: any }, modulePath: string) => {
  const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
  const value = await modulesFiles[modulePath]()
  modules[moduleName] = value.default
  return modules
}, {})

export default Utils
