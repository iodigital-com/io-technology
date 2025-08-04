// ===========================
// API TYPES
// ===========================

/**
 * Standard API error structure for consistent error handling
 * @example
 * ```typescript
 * const error: APIError = {
 *   code: "VALIDATION_ERROR",
 *   message: "Invalid input provided",
 *   details: { field: "email", reason: "invalid format" }
 * }
 * ```
 */
export interface APIError {
  code: string
  message: string
  details?: Record<string, unknown>
}

/**
 * Standard API response wrapper for consistent response structure
 * @example
 * ```typescript
 * const response: APIResponse<User> = {
 *   data: { id: 1, name: "John Doe" },
 *   meta: {
 *     timestamp: "2024-01-01T00:00:00.000Z",
 *     version: "1.0.0",
 *     requestId: "req_123"
 *   }
 * }
 * ```
 */
export interface APIResponse<T> {
  data?: T
  error?: APIError
  meta?: {
    timestamp: string
    version?: string
    requestId?: string
  }
}

/**
 * Result type for operations that can succeed or fail
 * @example
 * ```typescript
 * const successResult: Result<string> = { success: true, data: "Hello World" }
 * const errorResult: Result<string> = { success: false, error: { code: "ERROR", message: "Failed" } }
 * ```
 */
export type Result<T, E = APIError> = { success: true; data: T } | { success: false; error: E }

// ===========================
// API ADAPTER PATTERNS
// ===========================

/**
 * Generic adapter function for transforming external API responses to internal types
 * @example
 * ```typescript
 * const userAdapter: APIAdapter<ExternalUser, InternalUser> = (external) => ({
 *   id: external.user_id,
 *   name: external.full_name
 * })
 * ```
 */
export type APIAdapter<TExternal, TInternal> = (external: TExternal) => TInternal

/**
 * Validation helper for API responses with type guards
 * @example
 * ```typescript
 * const userValidator: APIValidator<User> = {
 *   validate: (data): data is User => typeof data === 'object' && 'id' in data,
 *   sanitize: (data) => ({ ...data, name: data.name.trim() })
 * }
 * ```
 */
export interface APIValidator<T> {
  validate: (data: unknown) => data is T
  sanitize?: (data: T) => T
}

/**
 * Combined adapter with validation for safe API response transformation
 * @example
 * ```typescript
 * const safeUserAdapter: SafeAPIAdapter<ExternalUser, InternalUser> = {
 *   transform: (external) => ({ id: external.user_id, name: external.full_name }),
 *   validate: { validate: (data): data is ExternalUser => 'user_id' in data }
 * }
 * ```
 */
export interface SafeAPIAdapter<TExternal, TInternal> {
  transform: APIAdapter<TExternal, TInternal>
  validate: APIValidator<TExternal>
}

// ===========================
// PAGINATION & SEARCH
// ===========================

/**
 * Pagination metadata for paginated responses
 * @example
 * ```typescript
 * const pagination: PaginationMeta = {
 *   currentPage: 1,
 *   totalPages: 10,
 *   totalItems: 100,
 *   itemsPerPage: 10
 * }
 * ```
 */
export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
}

/**
 * Pagination props for pagination components
 * @example
 * ```typescript
 * const paginationProps: PaginationProps = {
 *   currentPage: 1,
 *   totalPages: 5,
 *   basePath: "/articles",
 *   onPageChange: (page) => router.push(`/articles/page/${page}`)
 * }
 * ```
 */
export interface PaginationProps extends PaginationMeta {
  basePath: string
  onPageChange?: (page: number) => void
}

/**
 * Date range filter for search and filtering
 * @example
 * ```typescript
 * const dateRange: DateRange = {
 *   start: "2024-01-01",
 *   end: "2024-12-31"
 * }
 * ```
 */
export interface DateRange {
  start: string
  end: string
}

/**
 * Search filters for content filtering and search
 * @example
 * ```typescript
 * const filters: SearchFilters = {
 *   tags: ["typescript", "react"],
 *   authors: ["john-doe"],
 *   query: "advanced patterns",
 *   dateRange: { start: "2024-01-01", end: "2024-12-31" }
 * }
 * ```
 */
export interface SearchFilters {
  tags?: string[]
  authors?: string[]
  dateRange?: DateRange
  contentTypes?: import('./content').ContentType[]
  query?: string
}

/**
 * Generic search result with items and metadata
 * @example
 * ```typescript
 * const searchResult: SearchResult<Article> = {
 *   items: [{ title: "Article 1" }, { title: "Article 2" }],
 *   totalCount: 50,
 *   filters: { tags: ["typescript"] },
 *   pagination: { currentPage: 1, totalPages: 5 }
 * }
 * ```
 */
export interface SearchResult<T> {
  items: T[]
  totalCount: number
  filters: SearchFilters
  pagination: PaginationMeta
}
