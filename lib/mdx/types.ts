import type { FrontMatter } from '../../types'

// ===========================
// MDX CONTENT TYPES
// ===========================

export interface TableOfContents {
  value: string
  url: string
  depth: number
  children?: TableOfContents[]
}

export interface MDXContent {
  mdxSource: string
  toc: TableOfContents[]
  frontMatter: FrontMatter
  wordCount?: number
  estimatedReadingTime?: number
}

// Enhanced content type system
export type ContentType =
  | 'blog'
  | 'authors'
  | 'series'
  | 'talks'
  | 'workshops'
  | 'experiments'
  | 'contribute'

// MDX processing options
export interface MDXProcessingOptions {
  includeTOC?: boolean
  includeReadingTime?: boolean
  includeWordCount?: boolean
  headingLevels?: [number, number] // [min, max] heading levels for TOC
}

// MDX file metadata
export interface MDXFileMetadata {
  filePath: string
  slug: string
  contentType: ContentType
  lastModified: Date
  fileSize: number
}

// Enhanced MDX result
export interface ProcessedMDX {
  content: MDXContent
  metadata: MDXFileMetadata
  related?: FrontMatter[] // Related content suggestions
}

// Re-export FrontMatter for convenience
export type { FrontMatter }
