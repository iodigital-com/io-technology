import type { ContentItem, AuthorsMap } from '../../types'

export interface ContentListingProps {
  items?: ContentItem[]
  authors?: AuthorsMap
  contentType?: 'article' | 'talk' | 'workshop' | 'series' | 'experiment'
  layout?: 'grid' | 'list'
  showArchivedFilter?: boolean
  className?: string
  containerClassName?: string
}
