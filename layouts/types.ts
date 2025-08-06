import type { ReactNode } from 'react'
import type { FrontMatter, Author, PaginationMeta } from '../types'
import type { TableOfContents } from '../lib/mdx/types'

// ===========================
// BASE LAYOUT TYPES
// ===========================

export interface BaseLayoutProps {
  children: ReactNode
  className?: string
}

// ===========================
// CONTENT LAYOUT TYPES
// ===========================

export interface AuthorLayoutProps extends BaseLayoutProps {
  frontMatter: FrontMatter
  authorDetails: Author[]
  posts?: FrontMatter[]
  talks?: FrontMatter[]
  workshops?: FrontMatter[]
  availableStaticProps?: any
}

export interface EmptyLayoutProps extends BaseLayoutProps {
  // Minimal layout with no additional props
}

export interface ListLayoutProps extends BaseLayoutProps {
  posts: FrontMatter[]
  title: string
  initialDisplayPosts?: FrontMatter[]
  pagination?: PaginationMeta
  authors: { [key: string]: Author }
  theme?: 'blue' | 'green' | 'beige' | 'orange' | 'purple' | 'red'
  showSearch?: boolean
  showFilters?: boolean
  emptyStateMessage?: string
}

export interface PostLayoutProps extends BaseLayoutProps {
  frontMatter: FrontMatter
  authorDetails: Author[]
  next?: FrontMatter
  prev?: FrontMatter
  toc?: TableOfContents[]
  showToc?: boolean
  showAuthorInfo?: boolean
  showRelatedPosts?: boolean
  relatedPosts?: FrontMatter[]
}

export interface PostSimpleProps extends BaseLayoutProps {
  frontMatter: FrontMatter
  type: string
  authorDetails: Author[]
  availableStaticProps?: any
  showBreadcrumbs?: boolean
  showLastModified?: boolean
}

export interface SerieLayoutProps extends BaseLayoutProps {
  posts: FrontMatter[]
  authorDetails: Author[]
  frontMatter: FrontMatter
  next?: FrontMatter
  prev?: FrontMatter
  currentPostIndex?: number
  showSerieProgress?: boolean
  showSerieNavigation?: boolean
}

export interface SeriesLayoutProps extends BaseLayoutProps {
  series: FrontMatter[]
  authors: { [key: string]: Author }
  initialDisplaySeries?: FrontMatter[]
  pagination?: PaginationMeta
  title: string
  showSearch?: boolean
  groupByAuthor?: boolean
}

export interface StaticPageLayoutProps extends BaseLayoutProps {
  frontMatter: FrontMatter
  authorDetails?: Author[]
  showBreadcrumbs?: boolean
  showLastModified?: boolean
  showTableOfContents?: boolean
  toc?: TableOfContents[]
}

// ===========================
// LAYOUT COMPOSITION TYPES
// ===========================

// For nested layouts
export interface NestedLayoutProps {
  layout: 'author' | 'list' | 'post' | 'serie' | 'static' | 'empty'
  layoutProps: any
  children: ReactNode
}

// Layout with sidebar
export interface SidebarLayoutProps extends BaseLayoutProps {
  sidebar?: ReactNode
  sidebarPosition?: 'left' | 'right'
  sidebarWidth?: string
  collapsible?: boolean
}

// Layout with header and footer
export interface PageLayoutProps extends BaseLayoutProps {
  header?: ReactNode
  footer?: ReactNode
  showNavigation?: boolean
  showFooter?: boolean
}
