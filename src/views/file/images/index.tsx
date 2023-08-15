import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import FileApi from '@/api/modules/file'
import type { Artwork } from '@/api/types/file'
import { STATUS, Response } from '@/types'

export default defineComponent({
  setup() {
    const artworks = reactive<Artwork[]>([])
    const tabPosition = ref<'top' | 'bottom' | 'right' | 'left'>('top')
    onBeforeMount(() => {
      getArtworks()
    })
    const getArtworks = async () => {
      const res: Response<Artwork[]> = await FileApi.getArtworks()
      if (res.resultCode === STATUS.SUCCESS) {
        Object.assign(artworks, res.data)
      }
    }
    return { tabPosition, artworks }
  },
  render() {
    return (
      <>
        <div style={{ height: '100%' }}>
          <el-tabs tab-position={this.tabPosition} style={{ height: '100%' }} class="demo-tabs">
            {this.artworks.map((image: Artwork) => {
              return (
                <>
                  <el-tab-pane label={image.name}>
                    <div>
                      {image.artworksInfo.map((img: any) => {
                        return (
                          <>
                            <el-image
                              key={img.cover_url}
                              style={{ width: '200px', height: '200px' }}
                              src={img.cover_url}
                              preview-src-list={[img.cover_url]}
                            />
                          </>
                        )
                      })}
                    </div>
                  </el-tab-pane>
                </>
              )
            })}
          </el-tabs>
        </div>
      </>
    )
  }
})
