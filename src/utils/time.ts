/**
 * desc: 格式化时间
 * @param {number/Date} time 时间
 * @param {string} fmt 格式
 * @return 格式化hou de 时间
 */
export const format = (time: number | Date, fmt: string) => {
  time = typeof time === 'number' ? new Date(time) : time
  const o: { [key: string]: number } = {
    'M+': time.getMonth() + 1, //月份
    'd+': time.getDate(), //日
    'h+': time.getHours(), //小时
    'm+': time.getMinutes(), //分
    's+': time.getSeconds(), //秒
    'q+': Math.floor((time.getMonth() + 3) / 3), //季度
    S: time.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o)
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k].toString() : ('00' + o[k]).substr(('' + o[k]).length))
    }
  return fmt
}

/**
 * desc: 获取剩余 非整数
 * @param startDate
 * @param days
 * @param endDate
 */
export const getRestDays = (startDate: string, days: number, endDate = new Date()): number => {
  return (endDate.getTime() - (new Date(startDate + ' 00:00:00').getTime() + days * 86400000)) / 86400000
}

/**
 * desc: 判断是否为平年
 * @param year 年份
 * @return 是否为平年
 */
export const isOrdinaryYear = (year: number): boolean => {
  return !((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
}
