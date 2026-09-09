import { visit } from 'unist-util-visit'
import { slug } from 'github-slugger'
import type {
  RemarkTocHeadingsOptions,
  RemarkTocHeadingsTransformer,
} from './remark-toc-headings/types'
import type { Node } from 'unist'

// Define a more specific type for heading nodes
interface HeadingNode extends Node {
  type: 'heading'
  depth: number
  children?: Node[]
}

// Define a node with children property for recursive toString
interface NodeWithChildren extends Node {
  children?: NodeWithChildren[]
  value?: string
}

export default function remarkTocHeadings(
  options: RemarkTocHeadingsOptions
): RemarkTocHeadingsTransformer {
  return (tree: Node) =>
    visit(tree, 'heading', (node: HeadingNode) => {
      const textContent = toString(node as NodeWithChildren)
      options.exportRef.current.push({
        value: textContent,
        url: '#' + slug(textContent),
        depth: node.depth,
      })
    })
}

// Helper function to extract text content from a node
function toString(node: NodeWithChildren): string {
  if (node.type === 'text') return node.value || ''
  if (node.children) {
    return node.children.map(toString).join('')
  }
  return ''
}
