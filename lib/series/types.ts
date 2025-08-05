import type { FrontMatter } from '../../types'

export interface SerieData {
  title: string
  description?: string
  posts: FrontMatter[]
  slug: string
}

export interface SerieParams {
  serieID: string
  posts: FrontMatter[]
}
