import type { Node } from 'unist'

export interface RemarkCodeTitleOptions {
  // Options for the remark code title plugin
}

export type RemarkCodeTitleTransformer = (tree: Node) => void
