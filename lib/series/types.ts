import type { FrontMatter } from '../../types'

export interface SeriePost {
  slug: string
  title: string
}

export interface Serie {
  title: string
  posts: SeriePost[]
  slug: string
}

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
