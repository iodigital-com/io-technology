import type { Author } from '../../types'

export interface ExperimentProps {
  title: string
  images: string[]
  demo?: string
  code?: string
  authors: Author[]
  content: string
  border?: boolean
}
