import type { FrontMatter } from '../../types'

export interface SerieData {
  title: string
  description?: string
  posts: FrontMatter[]
}

export interface SerieParams {
  serieID: string
  posts: FrontMatter[]
}
