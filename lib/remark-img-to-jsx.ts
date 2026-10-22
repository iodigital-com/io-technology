import { visit } from 'unist-util-visit'
import { imageSize as sizeOf } from 'image-size'
import fs from 'fs'
import type { RemarkImgToJsxOptions, RemarkImgToJsxTransformer } from './remark-img-to-jsx/types'
import type { Node } from 'unist'

export default function remarkImgToJsx(
  _options: RemarkImgToJsxOptions = {}
): RemarkImgToJsxTransformer {
  return (tree: Node) => {
    visit(
      tree,
      // only visit p tags that contain an img element
      (node: any) =>
        node.type === 'paragraph' && node.children?.some((n: any) => n.type === 'image'),
      (node: any) => {
        const imageNode = node.children?.find((n: any) => n.type === 'image')

        // only local files
        if (fs.existsSync(`${process.cwd()}/public${imageNode.url}`)) {
          const buffer = fs.readFileSync(`${process.cwd()}/public${imageNode.url}`)
          const dimensions = sizeOf(buffer)

          // Convert original node to next/image
          ;((imageNode.type = 'mdxJsxFlowElement'),
            (imageNode.name = 'Image'),
            (imageNode.attributes = [
              { type: 'mdxJsxAttribute', name: 'alt', value: imageNode.alt },
              { type: 'mdxJsxAttribute', name: 'src', value: imageNode.url },
              { type: 'mdxJsxAttribute', name: 'width', value: dimensions.width },
              { type: 'mdxJsxAttribute', name: 'height', value: dimensions.height },
            ]))

          // Change node type from p to div to avoid nesting error
          node.type = 'div'
          node.children = [imageNode]
        }
      }
    )
  }
}
