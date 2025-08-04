import type { Node } from 'unist'
import type { VFile } from 'vfile'

export interface RemarkExtractFrontmatterOptions {
  // Options for the remark extract frontmatter plugin
}

export type RemarkExtractFrontmatterTransformer = (tree: Node, file: VFile) => void
