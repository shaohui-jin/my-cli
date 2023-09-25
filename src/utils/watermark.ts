const setWatermark = (str: string, id: string) => {
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id) as any)
  }
  const can = document.createElement('canvas')
  can.width = 200
  can.height = 100
  const cans: any = can.getContext('2d')
  cans.rotate((-15 * Math.PI) / 180)
  cans.font = '12px'
  cans.fillStyle = 'rgba(200, 200, 200, 0.30)'
  cans.textBaseline = 'Middle'
  cans.fillText(str, can.width / 10, can.height / 2)
  const div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '15px'
  div.style.left = '0px'
  div.style.position = 'fixed'
  div.style.zIndex = '10000000'
  div.style.width = `${document.documentElement.clientWidth}px`
  div.style.height = `${document.documentElement.clientHeight}px`
  div.style.background = `url(${can.toDataURL('image/png')}) left top repeat`
  document.body.appendChild(div)
}

const id =  Math.random().toString()

/**
 * 页面添加水印效果
 * @method set 设置水印
 * @method del 删除水印
 */
const watermark = {
  // 设置水印
  set: (str: string) => {
    setWatermark(str, id)
  },
  // 删除水印
  del: () => {
    if (document.getElementById(id) !== null) {
      document.body.removeChild(document.getElementById(id) as any)
    }
  }
}

export default watermark
