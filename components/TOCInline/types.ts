import type { TableOfContents } from '../../lib/mdx/types'

export interface TOCInlineProps {
  toc: TableOfContents[]
  indentDepth?: number
  fromHeading?: number
  toHeading?: number
  asDisclosure?: boolean
  exclude?: string | string[]
}
