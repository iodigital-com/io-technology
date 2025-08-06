import type { Author } from './content'

// ===========================
// EXPERIMENT TYPES
// ===========================

export interface ExperimentProps {
  title: string
  images: string[]
  demo?: string
  code?: string
  authors: Author[]
  content: string
  border?: boolean
}
