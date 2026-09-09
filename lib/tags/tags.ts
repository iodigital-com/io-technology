import { getAllFilesFrontMatter } from '../mdx'
import kebabCase from '../utils/kebabCase'
import type { ContentType } from '../mdx/types'
import type { TagCount } from './types'

export async function getAllTags(type: ContentType): Promise<TagCount> {
  const files = await getAllFilesFrontMatter(type)

  const tagCount: TagCount = {}
  // Iterate through each post, putting all found tags into `tags`
  files.forEach((file) => {
    if (file.tags && file.draft !== true) {
      file.tags.forEach((tag: string) => {
        const formattedTag = kebabCase(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag]! += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })

  return tagCount
}
