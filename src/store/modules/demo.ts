import {storeToRefs} from 'pinia'
import {CommonStore} from './common'


const commonStore = CommonStore()
const {userInfo} = storeToRefs(commonStore)

// 直接修改（不推荐）
commonStore.userInfo = { name: 'jsh' }

// 通过$patch
commonStore.$patch({
  userInfo:  { name: 'jsh' }
})

// 通过actions修改store
commonStore.setUserInfo( { name: 'jsh' })