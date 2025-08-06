import type { ContentType } from '../mdx/types'

export interface TagCount {
  [key: string]: number
}

export interface TagsParams {
  type: ContentType
}
