import getQueryString from './common'

/**
 * desc: 文件转base64
 * @param file 文件
 * @return 文件base64流
 */
const getBase64 = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => {
      console.group('===file转base64失败===')
      console.log('name====getBase64')
      console.log('file====', file)
      console.log('error====', error)
      console.groupEnd()
    }
  })
}

/**
 * @todo 还没有定义入参类型
 * desc: 处理下载的blob数据
 * @param response 接口返回的数据
 */
const handleBlob = (response: any) => {
  const filename = getQueryString(response.headers['content-disposition'], 'filename')
  const a = document.createElement('a')
  a.href = window.URL.createObjectURL(response.data)
  //设置文件名称
  a.download = filename as string
  if (navigator.userAgent.indexOf('Firefox') > 0) {
    // 火狐浏览器
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
  } else {
    a.click()
  }
  document.body.appendChild(a)
}

export default {
  getBase64,
  handleBlob
}
