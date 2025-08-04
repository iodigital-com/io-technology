import type { ContentType, FrontMatter } from '../mdx/types'
import type { Author, ThemeColor, Result } from '../../types'

// ===========================
// CONTENT DATA HOOK TYPES
// ===========================

// Content data parameters with better validation
export interface ContentDataParams {
  contentType: ContentType
  page?: number
  limit?: number
  filters?: {
    tags?: string[]
    authors?: string[]
    series?: string
    featured?: boolean
  }
  sortBy?: 'date' | 'title' | 'popularity' | 'creation'
  sortOrder?: 'asc' | 'desc'
}

// Sorting and filtering options
export interface SortedContentOptions {
  theme?: ThemeColor
  limit?: number
  featured?: boolean
  excludeDrafts?: boolean
  includeReadingTime?: boolean
}

// Pagination options with better defaults
export interface PaginatedPathsOptions {
  itemsPerPage?: number
  generateAll?: boolean
  basePath?: string
}

// Enhanced content with author details
export interface ContentWithAuthors extends Omit<FrontMatter, 'series'> {
  authorDetails: Author[]
  relatedPosts?: FrontMatter[]
  series?: string // Keep original series field
  seriesData?: {
    title: string
    posts: FrontMatter[]
    currentIndex: number
  }
}

// ===========================
// BRANDING THEME HOOK TYPES
// ===========================

export interface BrandingThemeHook {
  theme: ThemeColor
  setTheme: (theme: ThemeColor) => void
  toggleTheme: () => void
  availableThemes: ThemeColor[]
  isSystemTheme: boolean
}

// Theme configuration
export interface ThemeConfig {
  default: ThemeColor
  available: ThemeColor[]
  systemPreference?: boolean
  persistToStorage?: boolean
  storageKey?: string
}

// ===========================
// ASYNC STATE HOOK TYPES
// ===========================

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export interface AsyncStateActions<T> {
  execute: (...args: any[]) => Promise<void>
  reset: () => void
  setData: (data: T) => void
  setError: (error: string) => void
}

export type UseAsyncState<T> = [AsyncState<T>, AsyncStateActions<T>]

// ===========================
// FORM STATE HOOK TYPES
// ===========================

export interface FormField<T = any> {
  value: T
  error?: string
  touched: boolean
  dirty: boolean
  valid: boolean
}

export interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> }
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
  submitCount: number
  errors: string[]
}

export interface FormActions<T> {
  setValue: <K extends keyof T>(field: K, value: T[K]) => void
  setError: <K extends keyof T>(field: K, error: string) => void
  clearError: <K extends keyof T>(field: K) => void
  reset: () => void
  submit: () => Promise<Result<any>>
  validate: () => boolean
}

export type UseFormState<T extends Record<string, any>> = [FormState<T>, FormActions<T>]

// ===========================
// SEARCH HOOK TYPES
// ===========================

export interface SearchFilters {
  query?: string
  tags?: string[]
  contentTypes?: ContentType[]
  authors?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface SearchResult<T> {
  items: T[]
  totalCount: number
  hasMore: boolean
  facets?: {
    tags: Record<string, number>
    authors: Record<string, number>
    contentTypes: Record<ContentType, number>
  }
}

export interface SearchState<T> {
  results: SearchResult<T>
  filters: SearchFilters
  loading: boolean
  error: string | null
  suggestions: string[]
}

export interface SearchActions {
  search: (query: string) => Promise<void>
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void
  clearFilters: () => void
  loadMore: () => Promise<void>
  reset: () => void
}

export type UseSearch<T> = [SearchState<T>, SearchActions]

// ===========================
// LOCAL STORAGE HOOK TYPES
// ===========================

export interface StorageOptions {
  serialize?: (value: any) => string
  deserialize?: (value: string) => any
  defaultValue?: any
  syncAcrossTabs?: boolean
}

export type UseLocalStorage<T> = [T, (value: T | ((prev: T) => T)) => void, () => void]
