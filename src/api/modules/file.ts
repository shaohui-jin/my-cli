import type { Artwork, IFileApi } from '@/api/types/file'
import imageList from '../mock/imageList.json'
import type { Response } from '@/types'

const FileApi: IFileApi = {
  getArtworks: () => {
    return new Promise<Response<Artwork[]>>(resolve => {
      resolve(imageList as any as Response<Artwork[]>)
      // resolve('1')
    })
  }
  // login: () => {
  //   return fetch({
  //     method: 'post',
  //     url: '/login',
  //     data: {}
  //   })
  // }
}

export default FileApi
