import { checkUndefined } from '@/utils/common.ts'

export interface Extra {
  path?: string // 路径
  millisecond?: number // 分钟
  domain?: string // 域名
  type: 'cookie' | 'localStorage' | 'sessionStorage' // 类型
}

/**
 * 作用：添加cookie
 * @param key  key值
 * @param value  value值
 * @param extra  额外拓展信息
 * return boolean
 * 逻辑：
 * 1. type为localStorage且localStorage存在，使用localStorage
 * 2. type为sessionStorage且sessionStorage存在，使用sessionStorage
 * 3. 都不支持的情况下,判断millisecond是否存在，存在就定cookie的过期时间
 * 5. 不存在就默认30s存储时间
 */
export const setCookie: (key: string, value: string, extra?: Extra) => boolean = (
  key: string,
  value: string,
  extra: Extra = { type: 'sessionStorage' }
) => {
  try {
    if (extra.type === 'localStorage' && !checkUndefined(localStorage)) {
      // 类型是localStorage且localStorage存在，则使用这个
      window.localStorage.setItem(key, value)
      return true
    }

    if (extra.type === 'sessionStorage' && !checkUndefined(sessionStorage)) {
      // 类型是sessionStorage且sessionStorage存在，则使用这个
      window.sessionStorage.setItem(key, value)
      return true
    }

    // 都无效的化，直接使用cookie存储
    const date = new Date().getTime() + (extra.millisecond || 0.5) * 1000 * 60
    window.document.cookie = `${key}=${value};expires=${new Date(date)};domain=${
      extra.domain || document.domain
    };path=${extra.path || '/'}`

    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

/**
 * 作用：读取cookie值
 * @param key key值
 * @param extra 额外拓展信息
 * return value值
 */
export const getCookie: (key: string, extra?: Extra) => string | null = (
  key: string,
  extra: Extra = { type: 'sessionStorage' }
) => {
  try {
    if (extra.type === 'localStorage' && !checkUndefined(localStorage)) {
      return window.localStorage.getItem(key)
    }

    if (extra.type === 'sessionStorage' && !checkUndefined(sessionStorage)) {
      return window.sessionStorage.getItem(key)
    }

    const reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')
    const result: RegExpMatchArray | null = document.cookie.match(reg)
    return result?.length ? unescape(result[2]) : null
  } catch (err: any) {
    console.log(err)
    throw new Error(err)
  }
}

/**
 * 作用 移除cookie
 * @param key key值
 * @param extra 额外拓展信息
 * return boolean
 */
export const removeCookie: (key: string, extra?: Extra) => boolean = (
  key: string,
  extra: Extra = { type: 'sessionStorage' }
) => {
  try {
    if (extra.type === 'localStorage' && !checkUndefined(localStorage)) {
      window.localStorage.removeItem(key)
      return true
    }

    if (extra.type === 'sessionStorage' && !checkUndefined(sessionStorage)) {
      window.sessionStorage.removeItem(key)
      return true
    }

    const date = new Date().getTime() - 1000 * 60
    window.document.cookie = `${key}=;expires=${new Date(date)};domain=${extra.domain || document.domain};path=${
      extra.path || '/'
    }`

    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

/**
 * 作用：清除所有的cookie
 * @param extra 额外信息
 */
export const removeAll: (extra?: Extra) => boolean = (extra: Extra = { type: 'sessionStorage' }) => {
  try {
    if (extra.type === 'localStorage' && !checkUndefined(localStorage)) {
      window.localStorage.clear()
      return true
    }

    if (extra.type === 'sessionStorage' && !checkUndefined(sessionStorage)) {
      window.sessionStorage.clear()
      return true
    }

    const keys: RegExpMatchArray | null = document.cookie.match(/[^ =;]+(?==)/g)
    if (keys) {
      for (let i = keys.length; i > 0; i--) {
        document.cookie = `${keys[i]}=;path=${extra.path || '/'};domain=${
          extra.domain || document.domain
        };expires=${new Date(0).toUTCString()}`
      }
    }

    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
