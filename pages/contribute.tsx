import { getFileBySlug } from '@/lib/mdx'

import { MDXLayoutRenderer } from '@/components/MDXComponents'
import type { MDXContent } from '../lib/mdx/types'

const DEFAULT_LAYOUT = 'StaticPageLayout'

export async function getStaticProps() {
  const content = await getFileBySlug('contribute', 'contribute')

  return {
    props: {
      content,
      theme: 'green',
    },
  }
}

interface ContributeProps {
  content: MDXContent
}

export default function Contribute({ content }: ContributeProps) {
  const { mdxSource, toc, frontMatter } = content

  return (
    <MDXLayoutRenderer
      layout={(frontMatter.layout as string) || DEFAULT_LAYOUT}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
      toc={toc}
    />
  )
}
