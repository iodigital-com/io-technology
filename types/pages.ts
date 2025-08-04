import type { ContentItem, FrontMatter, Author, AuthorsMap } from './content'
import type { PaginationMeta } from './api'
import type { TableOfContents } from '../lib/mdx/types'

// ===========================
// PAGE TYPES
// ===========================

export interface BasePageProps {
  authors?: AuthorsMap
  pagination?: PaginationMeta
}

// Generic page props that most pages extend
export interface PageProps extends BasePageProps {
  posts?: ContentItem[]
  tags?: string[]
  frontMatter?: FrontMatter
  mdxSource?: string
  toc?: TableOfContents[]
  authorDetails?: Author[]
  [key: string]: unknown
}
