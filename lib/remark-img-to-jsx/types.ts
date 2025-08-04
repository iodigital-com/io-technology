import type { Node } from 'unist'

/**
 * Configuration options for the remark img to jsx plugin
 * @example
 * ```typescript
 * const options: RemarkImgToJsxOptions = {
 *   className: "responsive-image",
 *   loading: "lazy",
 *   sizes: "(max-width: 768px) 100vw, 50vw"
 * }
 * ```
 */
export interface RemarkImgToJsxOptions {
  /** CSS class name to apply to converted images */
  className?: string
  /** Loading strategy for images */
  loading?: 'lazy' | 'eager'
  /** Responsive image sizes attribute */
  sizes?: string
  /** Whether to add width and height attributes */
  addDimensions?: boolean
  /** Custom component name to use instead of 'Image' */
  componentName?: string
  /** Additional props to pass to the Image component */
  additionalProps?: Record<string, unknown>
}

/**
 * Transformer function that processes AST nodes to convert img tags to JSX Image components
 * @param tree - The AST tree to transform
 * @param options - Configuration options for the transformation
 * @example
 * ```typescript
 * const transformer: RemarkImgToJsxTransformer = (tree, options) => {
 *   visit(tree, 'image', (node) => {
 *     // Transform image node to JSX
 *   })
 * }
 * ```
 */
export type RemarkImgToJsxTransformer = (tree: Node, options?: RemarkImgToJsxOptions) => void

/**
 * Image node structure in the AST
 * @example
 * ```typescript
 * const imageNode: ImageNode = {
 *   type: 'image',
 *   url: '/images/example.jpg',
 *   alt: 'Example image',
 *   title: 'An example image'
 * }
 * ```
 */
export interface ImageNode extends Node {
  type: 'image'
  url: string
  alt?: string
  title?: string
}

/**
 * JSX element node that replaces the image node
 * @example
 * ```typescript
 * const jsxNode: JSXElementNode = {
 *   type: 'mdxJsxFlowElement',
 *   name: 'Image',
 *   attributes: [
 *     { type: 'mdxJsxAttribute', name: 'src', value: '/images/example.jpg' },
 *     { type: 'mdxJsxAttribute', name: 'alt', value: 'Example image' }
 *   ]
 * }
 * ```
 */
export interface JSXElementNode extends Node {
  type: 'mdxJsxFlowElement'
  name: string
  attributes: JSXAttribute[]
}

/**
 * JSX attribute for Image component props
 */
export interface JSXAttribute {
  type: 'mdxJsxAttribute'
  name: string
  value: string | number | boolean | null
}
