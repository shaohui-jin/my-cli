import { defineComponent, onBeforeMount, reactive } from 'vue'
import FileApi from '@/api/modules/file.ts'
import type { Artwork } from '@/api/types/file.ts'
import { STATUS, Response } from '@/types'
import { IFileApi } from '@/api/types/file.ts'

export default defineComponent({
  setup() {
    let artworks = reactive<Artwork[]>([])
    onBeforeMount(() => {
      getArtworks()
    })
    const getArtworks = async () => {
      const res: Response<Artwork[]> = await FileApi.getArtworks()
      if (res.resultCode === STATUS.SUCCESS) {
        Object.assign(artworks, res.data)
        console.log(artworks)
      }
    }
    return {
      artworks
    }
  },
  render() {
    return (
      <>
        <div>
          {this.artworks.map((image: Artwork) => {
            return (
              <>
                <span>{image.name}</span>
                <div>
                  {image.artworksInfo.map(img => {
                    return (
                      <>
                        <el-image
                          key={img.cover_url}
                          style={{ width: '200px', height: '200px' }}
                          src={img.cover_url}
                          preview-src-list={[img.cover_url]}
                          lazy
                        />
                      </>
                    )
                  })}
                </div>
              </>
            )
          })}
        </div>
      </>
    )
  }
})
