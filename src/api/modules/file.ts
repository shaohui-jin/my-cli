import { IFileApi } from '@/api/types/file'
// import fetch from '@/api/fetch.ts'
import fileJson from './response.json'

const FileApi: IFileApi = {
  getImageList: () => {
    return new Promise(resolve => {
      resolve(fileJson)
    })
  },
  // login: () => {
  //   return fetch({
  //     method: 'post',
  //     url: '/login',
  //     data: {}
  //   })
  // }
}

export default FileApi
