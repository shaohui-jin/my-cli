import {storeToRefs} from 'pinia'
import { UserStore } from './user'


const userStore = UserStore()
const { userInfo } = storeToRefs(userStore)
console.log(userInfo);

// 直接修改（不推荐）
userStore.userInfo = { userName: '不推荐的方式修改的name', token: '不推荐的方式修改的token' }
console.log(userInfo);

// 通过$patch
userStore.$patch({
  userInfo:  { userName: '通过$patch修改的name', token: '通过$patch修改的token' }
})
console.log(userInfo);

// 通过actions修改store
userStore.setUserInfo( { userName: '通过actions修改的name', token: '通过actions修改的name' })
console.log(userInfo);
