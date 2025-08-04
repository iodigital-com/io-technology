// ===========================
// HTML ESCAPING TYPES
// ===========================

// Basic escape function type
export type EscapeFunction = (input: string | null | undefined) => string

// Escape mapping for HTML entities
export interface EscapeMap {
  readonly [key: string]: string
}

// Default HTML entity mappings
export interface DefaultEscapeMap extends EscapeMap {
  readonly '&': '&amp;'
  readonly '<': '&lt;'
  readonly '>': '&gt;'
  readonly "'": '&#39;'
  readonly '"': '&quot;'
}

// Escape options and configurations
export interface EscapeOptions {
  // Basic escaping
  escapeQuotes?: boolean
  escapeApostrophes?: boolean
  escapeNewlines?: boolean

  // Advanced options
  preserveWhitespace?: boolean
  maxLength?: number

  // Custom mappings
  customMappings?: Record<string, string>
  additionalChars?: string[]

  // Security levels
  strictMode?: boolean
  allowedTags?: string[]
  allowedAttributes?: string[]
}

// Sanitization levels
export type SanitizationLevel = 'basic' | 'strict' | 'paranoid' | 'custom'

// HTML sanitization result
export interface SanitizeResult {
  sanitized: string
  wasModified: boolean
  removedTags?: string[]
  removedAttributes?: string[]
  warnings?: string[]
}

// Content security types
export interface ContentSecurityOptions {
  level: SanitizationLevel
  allowHTML?: boolean
  allowScripts?: boolean
  allowStyles?: boolean
  allowLinks?: boolean
  maxLength?: number
}

// URL and link escaping
export interface URLEscapeOptions {
  encodeSpaces?: boolean
  encodeUnicode?: boolean
  preserveQuery?: boolean
  preserveFragment?: boolean
}

// Attribute escaping for specific contexts
export type AttributeContext = 'href' | 'src' | 'data' | 'class' | 'id' | 'style' | 'title'
