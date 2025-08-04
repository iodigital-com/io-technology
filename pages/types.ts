import type { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import type { FrontMatter, Author, Event, PaginationMeta, AuthorsMap } from '../types'
import type { Job } from '../lib/jobs/types'

// ===========================
// COMMON PAGE TYPES
// ===========================

// Base props that all pages share
export interface BasePageProps {
  authors?: AuthorsMap
  pagination?: PaginationMeta
  theme?: 'blue' | 'green' | 'beige' | 'orange' | 'purple' | 'red'
}

// Static generation context
export interface StaticPropsContext {
  params?: { [key: string]: string | string[] }
  preview?: boolean
  previewData?: any
  locale?: string
  locales?: string[]
  defaultLocale?: string
}

// ===========================
// ARTICLE/BLOG PAGE TYPES
// ===========================

export interface ArticlePageProps extends BasePageProps {
  post: FrontMatter
  authorDetails: Author[]
  prev?: FrontMatter
  next?: FrontMatter
  jobs?: Job[]
  events?: Event[]
  serie?: {
    title: string
    description?: string
    posts: FrontMatter[]
  }
  toc?: any[]
}

export interface ArticlesPageProps extends BasePageProps {
  blog: FrontMatter[]
  initialDisplayBlog: FrontMatter[]
  pagination: PaginationMeta
}

// ===========================
// SERIES PAGE TYPES
// ===========================

export interface SeriePageProps extends BasePageProps {
  posts: FrontMatter[]
  authorDetails: Author[]
  prev?: FrontMatter
  next?: FrontMatter
  jobs?: Job[]
  events?: Event[]
  serie: {
    title: string
    description?: string
    posts: FrontMatter[]
  }
}

export interface SeriesPageProps extends BasePageProps {
  series: FrontMatter[]
  initialDisplaySeries: FrontMatter[]
  pagination: PaginationMeta
}

// ===========================
// TALK PAGE TYPES
// ===========================

export interface TalkPageProps extends BasePageProps {
  talk: FrontMatter
  authorDetails: Author[]
}

export interface TalksPageProps extends BasePageProps {
  talks: FrontMatter[]
  highlightedAuthors?: Author[]
}

// ===========================
// WORKSHOP PAGE TYPES
// ===========================

export interface WorkshopPageProps extends BasePageProps {
  workshop: FrontMatter
  authorDetails: Author[]
}

export interface WorkshopsPageProps extends BasePageProps {
  workshops: FrontMatter[]
}

// ===========================
// VIDEO PAGE TYPES
// ===========================

export interface VideoPageProps {
  video: {
    id: string
    title: string
    description?: string
    url: string
    publishedAt?: string
    duration?: string
  }
}

export interface VideosPageProps {
  videos: Array<{
    id: string
    title: string
    description?: string
    url: string
    thumbnail?: string
    publishedAt?: string
  }>
}

// ===========================
// TAG & SEARCH PAGE TYPES
// ===========================

export interface TagPageProps extends BasePageProps {
  posts: FrontMatter[]
  tag: string
  title: string
}

export interface TagsPageProps {
  tags: { [tagName: string]: number }
}

// ===========================
// AUTHOR PAGE TYPES
// ===========================

export interface AuthorPageProps extends BasePageProps {
  authorDetails: Author
  posts: FrontMatter[]
  talks: FrontMatter[]
  workshops: FrontMatter[]
}

// ===========================
// EXPERIMENT PAGE TYPES
// ===========================

export interface ExperimentPageProps {
  experiments: Array<{
    title: string
    description?: string
    demo?: string
    code?: string
    images: string[]
    authors: Author[]
    slug: string
  }>
}

// ===========================
// SPECIAL PAGE TYPES
// ===========================

export interface ContributePageProps {
  content: {
    frontMatter: FrontMatter
    mdxSource: string
  }
}

export interface ErrorPageProps {
  error: string | number
  statusCode?: number
  hasGetInitialPropsRun?: boolean
  err?: Error
}

// ===========================
// HOME PAGE TYPES
// ===========================

export interface HomePageProps extends BasePageProps {
  posts: FrontMatter[]
  videos: Array<{
    id: string
    title: string
    url: string
    thumbnail?: string
  }>
  jobs: Job[]
  events: Event[]
  featuredContent?: {
    articles?: FrontMatter[]
    talks?: FrontMatter[]
    workshops?: FrontMatter[]
  }
}

// ===========================
// ROUTE PARAMETER TYPES
// ===========================

export interface PaginationParams {
  page: string
}

export interface SlugParams {
  slug: string[]
}

export interface SingleSlugParams {
  slug: string
}

export interface TagParams {
  tag: string
}

export interface ErrorParams {
  error: string
}

// ===========================
// NEXT.JS FUNCTION TYPES
// ===========================

export type PageGetStaticProps<T extends Record<string, any> = Record<string, any>> =
  GetStaticProps<T, any>
export type PageGetStaticPaths = GetStaticPaths
export type PageGetServerSideProps<T extends Record<string, any> = Record<string, any>> =
  GetServerSideProps<T, any>
