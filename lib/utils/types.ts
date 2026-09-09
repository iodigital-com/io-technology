// Generic utility types
export type Comparator<T> = (a: T, b: T) => number

// File utility types
export type FileProcessor<T> = (input: T) => T
export type PathMapper = (fullPath: string) => string[]

// Date utility types
export interface DateFormatOptions {
  year?: 'numeric' | '2-digit'
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow'
  day?: 'numeric' | '2-digit'
  locale?: string
}

// HTML escaper types
export type EscapeFunction = (input: string) => string

// Kebab case types
export type StringTransformer = (input: string) => string

// Sort utility types
export interface WithCreationDate {
  creationDate: string
}

export interface WithDate {
  date: string
}

// ===========================
// TYPE GUARDS
// ===========================

// Generic type guards for better runtime safety
export const isString = (value: unknown): value is string => typeof value === 'string'

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && !isNaN(value)

export const isValidDate = (value: unknown): value is Date =>
  value instanceof Date && !isNaN(value.getTime())

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const hasProperty = <T extends PropertyKey>(
  obj: object,
  prop: T
): obj is Record<T, unknown> => prop in obj

// Content-specific type guards
export const isContentItem = (value: unknown): value is import('../../types').ContentItem =>
  isObject(value) &&
  hasProperty(value, 'slug') &&
  hasProperty(value, 'title') &&
  isString(value.slug) &&
  isString(value.title)
