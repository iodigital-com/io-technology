// ===========================
// ENUMS FOR BETTER TYPE SAFETY
// ===========================

/**
 * Theme colors available throughout the application
 * @example
 * ```typescript
 * const theme: Theme = Theme.BLUE
 * ```
 */
export enum Theme {
  BLUE = 'blue',
  GREEN = 'green',
  BEIGE = 'beige',
  ORANGE = 'orange',
  PURPLE = 'purple',
  RED = 'red',
}

/**
 * Content types supported by the application
 * @example
 * ```typescript
 * const contentType: ContentType = ContentType.ARTICLE
 * ```
 */
export enum ContentType {
  ARTICLE = 'article',
  TALK = 'talk',
  WORKSHOP = 'workshop',
  SERIES = 'series',
  EXPERIMENT = 'experiment',
}

// ===========================
// CORE CONTENT TYPES
// ===========================

/**
 * Reading time calculation results from the reading-time library
 * @example
 * ```typescript
 * const readingTime: ReadingTime = {
 *   text: "5 min read",
 *   minutes: 5,
 *   time: 300000,
 *   words: 1000
 * }
 * ```
 */
export interface ReadingTime {
  text: string
  minutes: number
  time: number
  words: number
}

/**
 * Base content interface containing common properties for all content types
 * @example
 * ```typescript
 * const baseContent: BaseContent = {
 *   slug: "my-article",
 *   fileName: "my-article.mdx",
 *   creationDate: "2024-01-01T00:00:00.000Z"
 * }
 * ```
 */
export interface BaseContent {
  slug: string | null
  fileName?: string
  creationDate?: string
  lastmod?: string
  draft?: boolean
}

/**
 * Enhanced FrontMatter interface with comprehensive metadata for content items
 * @example
 * ```typescript
 * const frontMatter: FrontMatter = {
 *   slug: "typescript-best-practices",
 *   title: "TypeScript Best Practices",
 *   date: "2024-01-01T00:00:00.000Z",
 *   tags: ["typescript", "programming"],
 *   summary: "Learn the best practices for TypeScript development",
 *   authors: ["john-doe"],
 *   theme: Theme.BLUE
 * }
 * ```
 */
export interface FrontMatter extends BaseContent {
  title: string
  date: string | null
  tags: string[]
  summary: string
  authors: string[]
  images?: string[]
  theme?: Theme
  canonicalUrl?: string
  series?: string
  readingTime?: ReadingTime
  hideInArticleList?: boolean
  [key: string]: unknown // Better than any - allows additional props but safer
}

// ===========================
// AUTHOR TYPES
// ===========================

/**
 * Social media links for an author
 * @example
 * ```typescript
 * const socialLinks: SocialLinks = {
 *   twitter: "https://twitter.com/johndoe",
 *   github: "https://github.com/johndoe",
 *   linkedin: "https://linkedin.com/in/johndoe"
 * }
 * ```
 */
export interface SocialLinks {
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
  website?: string
}

/**
 * Enhanced Author interface with comprehensive author information
 * @example
 * ```typescript
 * const author: Author = {
 *   name: "John Doe",
 *   avatar: "/authors/john-doe.jpg",
 *   occupation: "Senior Developer",
 *   company: "Tech Corp",
 *   slug: ["john-doe"],
 *   bio: "Passionate about TypeScript and React",
 *   social: {
 *     twitter: "https://twitter.com/johndoe",
 *     github: "https://github.com/johndoe"
 *   }
 * }
 * ```
 */
export interface Author {
  name: string
  avatar: string
  occupation?: string
  company?: string
  slug: string[]
  archived?: boolean
  bio?: string
  social?: SocialLinks
}

/**
 * Mapping of author slugs to Author objects for efficient lookups
 * @example
 * ```typescript
 * const authors: AuthorsMap = {
 *   "john-doe": { name: "John Doe", avatar: "/john.jpg", slug: ["john-doe"] },
 *   "jane-smith": { name: "Jane Smith", avatar: "/jane.jpg", slug: ["jane-smith"] }
 * }
 * ```
 */
export interface AuthorsMap {
  [authorSlug: string]: Author
}

// ===========================
// CONTENT ITEM TYPES
// ===========================

/**
 * Complete content item with all metadata and optional media links
 * @example
 * ```typescript
 * const contentItem: ContentItem = {
 *   slug: "my-talk",
 *   title: "Advanced TypeScript",
 *   date: "2024-01-01T00:00:00.000Z",
 *   tags: ["typescript"],
 *   summary: "Deep dive into TypeScript",
 *   authors: ["john-doe"],
 *   type: ContentType.TALK,
 *   video: "https://youtube.com/watch?v=123",
 *   slides: "https://slides.com/123"
 * }
 * ```
 */
export interface ContentItem extends FrontMatter {
  type?: ContentType
  video?: string
  slides?: string
  demo?: string
  code?: string
  content?: string
}

/**
 * File data structure for content file metadata
 * @example
 * ```typescript
 * const fileData: FileData = {
 *   slug: "my-article",
 *   date: "2024-01-01T00:00:00.000Z",
 *   title: "My Article",
 *   path: "/content/my-article.mdx",
 *   size: 1024,
 *   mimeType: "text/markdown"
 * }
 * ```
 */
export interface FileData {
  slug: string
  date: string
  title: string
  path?: string
  size?: number
  lastModified?: string
  mimeType?: string
}
