// ===========================
// FILE PROCESSING TYPES
// ===========================

// Generic function composition types
export type FileProcessor<T> = (input: T) => T
export type AsyncFileProcessor<T> = (input: T) => Promise<T>

// Path operations
export type PathMapper = (fullPath: string) => string[]
export type PathTransformer = (path: string) => string
export type PathValidator = (path: string) => boolean

// Array operations with better typing
export type FlattenFunction<T> = (input: T[]) => T[]
export type MapFunction<T, R> = (fn: (item: T) => R) => (input: T[]) => R[]
export type FilterFunction<T> = (predicate: (item: T) => boolean) => (input: T[]) => T[]

// File system operations
export interface FileStats {
  size: number
  created: Date
  modified: Date
  accessed: Date
  isFile: boolean
  isDirectory: boolean
  permissions?: string
}

export interface FileMetadata {
  path: string
  name: string
  extension: string
  size: number
  mimeType?: string
  encoding?: string
  stats: FileStats
}

// File processing options
export interface FileProcessingOptions {
  recursive?: boolean
  includeHidden?: boolean
  followSymlinks?: boolean
  maxDepth?: number
  extensions?: string[]
  excludePatterns?: RegExp[]
  includePatterns?: RegExp[]
}

// File filtering and searching
export interface FileFilter {
  name?: string | RegExp
  extension?: string[]
  size?: {
    min?: number
    max?: number
  }
  modified?: {
    before?: Date
    after?: Date
  }
  content?: string | RegExp
}

// Error handling for file operations
export interface FileOperationError {
  code: string
  message: string
  path: string
  operation: 'read' | 'write' | 'delete' | 'create' | 'move' | 'copy'
  originalError?: Error
}

export type FileOperationResult<T> =
  | { success: true; data: T }
  | { success: false; error: FileOperationError }

// Batch file operations
export interface BatchOperation<T> {
  files: string[]
  operation: (file: string) => Promise<T>
  options?: {
    parallel?: boolean
    maxConcurrency?: number
    continueOnError?: boolean
  }
}

export interface BatchOperationResult<T> {
  successful: Array<{ file: string; result: T }>
  failed: Array<{ file: string; error: FileOperationError }>
  summary: {
    total: number
    successful: number
    failed: number
    duration: number
  }
}
