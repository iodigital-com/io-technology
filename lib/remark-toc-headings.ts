import { visit } from 'unist-util-visit'
import { slug } from 'github-slugger'
import type {
  RemarkTocHeadingsOptions,
  RemarkTocHeadingsTransformer,
} from './remark-toc-headings/types'
import type { Node } from 'unist'

export default function remarkTocHeadings(
  options: RemarkTocHeadingsOptions
): RemarkTocHeadingsTransformer {
  return (tree: Node) =>
    visit(tree, 'heading', (node: any) => {
      const textContent = toString(node)
      options.exportRef.current.push({
        value: textContent,
        url: '#' + slug(textContent),
        depth: node.depth,
      })
    })
}

// Helper function to extract text content from a node
function toString(node: any): string {
  if (node.type === 'text') return node.value
  if (node.children) {
    return node.children.map(toString).join('')
  }
  return ''
}
