type User = {
  username: string
  roleType: string
}

const getCurrentUser = (): User => {
  return {
    username: 'test',
    roleType: '1'
  }
}

const checkUserPermissions = (user: User, permissions: string): boolean => {
  return user.roleType.includes(permissions)
}

/**
 * desc: 权限装饰器 @roleDecorator
 * @param permissions
 * @constructor
 */
export const roleDecorator = (permissions: string) => {
  return function (target: any, key: string, descriptor: any) {
    window.App.$console.log('@roleDecorator:', target, key, descriptor)
    const originalMethod = descriptor.value // 保存原始方法

    descriptor.value = function (...args: any[]) {
      // 在原始方法执行前进行权限验证
      const user: User = getCurrentUser() // 获取当前用户信息

      // 检查用户是否拥有所需权限
      const hasPermission: boolean = checkUserPermissions(user, permissions)

      if (!hasPermission) {
        // 如果用户没有权限，则抛出错误或执行其他处理
        throw new Error('无权限访问该接口')
      }

      // 执行原始方法
      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}
