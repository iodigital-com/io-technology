// ===========================
// ADVANCED TYPESCRIPT UTILITIES
// ===========================

// Branded types for better type safety with IDs
declare const brand: unique symbol
export type Brand<T, TBrand> = T & { [brand]: TBrand }

// Specific ID types to prevent mixing
export type ContentID = Brand<string, 'ContentID'>
export type AuthorID = Brand<string, 'AuthorID'>
export type JobID = Brand<string, 'JobID'>
export type EventID = Brand<string, 'EventID'>

// Helper functions to create branded types
export const createContentID = (id: string): ContentID => id as ContentID
export const createAuthorID = (id: string): AuthorID => id as AuthorID
export const createJobID = (id: string): JobID => id as JobID
export const createEventID = (id: string): EventID => id as EventID

// ===========================
// UTILITY TYPES
// ===========================

// Make specific properties required
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Make specific properties optional
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Deep readonly type
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? DeepReadonly<U>[]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

// Non-empty array type
export type NonEmptyArray<T> = [T, ...T[]]

// String literal utilities
export type Lowercase<S extends string> = S extends `${infer F}${infer R}`
  ? `${Lowercase<F>}${Lowercase<R>}`
  : S

// Function type utilities
export type AsyncFunction<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => infer R
  ? (...args: P) => Promise<R>
  : never

// ===========================
// VALIDATION TYPES
// ===========================

// Schema validation type
export interface ValidationSchema<T> {
  validate: (data: unknown) => data is T
  errors?: string[]
}

// Runtime type checking result
export type TypeCheckResult<T> = { success: true; data: T } | { success: false; errors: string[] }
