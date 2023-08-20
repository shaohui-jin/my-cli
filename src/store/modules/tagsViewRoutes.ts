import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { CookieEnum } from '@/constant'

export type TagViewType = {
  tagsViewRoutes: any[]
  // isTagsViewCurrenFull: boolean
  // isColumnsNavHover: boolean
}
export const TagViewStore = defineStore(
  'tagView',
  () => {
    const tagView = reactive<TagViewType>({
      tagsViewRoutes: []
      // isTagsViewCurrenFull: false,
    })

    const setTagsViewRoutes = (data: Array<string>) => (tagView.tagsViewRoutes = data)

    return {
      ...toRefs(tagView),
      setTagsViewRoutes
      // setColumnsMenuHover,
      // setColumnsNavHover
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: CookieEnum.TAG_VIEW_ROUTE,
          storage: window.localStorage
        }
      ]
    }
  }
)
