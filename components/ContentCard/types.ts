import type { Author } from '../../types'

// Base content information
interface ContentCardContent {
  slug: string
  title: string
  summary?: string
  date: string
  tags?: string[]
  authors?: Author[]
}

// Display configuration
interface ContentCardDisplay {
  showDate?: boolean
  showAuthors?: boolean
  showTags?: boolean
  showSummary?: boolean
  showReadMore?: boolean
}

// Layout and styling
interface ContentCardPresentation {
  border?: boolean
  layout?: 'default' | 'list' | 'compact'
  basePath?: string
}

// Content type specific props
interface ContentCardTypeSpecific {
  type?: 'article' | 'talk' | 'workshop' | 'series' | 'experiment' | 'serie'
  video?: string
  slides?: string
  images?: string[]
}

// Composed interface using intersection types
export interface ContentCardProps
  extends
    ContentCardContent,
    ContentCardDisplay,
    ContentCardPresentation,
    ContentCardTypeSpecific {}
