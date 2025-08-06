import type { Node } from 'unist'

export interface Heading {
  value: string
  url: string
  depth: number
}

export interface RemarkTocHeadingsOptions {
  exportRef: { current: Heading[] }
}

export type RemarkTocHeadingsTransformer = (tree: Node) => void
