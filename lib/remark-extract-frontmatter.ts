import { visit } from 'unist-util-visit'
import { load } from 'js-yaml'
import type {
  RemarkExtractFrontmatterOptions,
  RemarkExtractFrontmatterTransformer,
} from './remark-extract-frontmatter/types'
import type { Node } from 'unist'
import type { VFile } from 'vfile'

export default function remarkExtractFrontmatter(
  _options: RemarkExtractFrontmatterOptions = {}
): RemarkExtractFrontmatterTransformer {
  return (tree: Node, file: VFile) => {
    visit(tree, 'yaml', (node: any) => {
      file.data.frontmatter = load(node.value)
    })
  }
}
