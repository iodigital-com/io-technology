import { getFileBySlug } from '@/lib/mdx'

import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'

import { MDXLayoutRenderer } from '@/components/MDXComponents'

const DEFAULT_LAYOUT = 'StaticPageLayout'

export async function getStaticProps() {
  const content = await getFileBySlug('contribute', ['contribute'])

  return { props: { content } }
}

export default function Contribute({ content }) {
  const { mdxSource, frontMatter } = content

  return (
    <>
      <PageSEO
        title={`Contribute - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />

      <MDXLayoutRenderer
        layout={frontMatter.layout || DEFAULT_LAYOUT}
        mdxSource={mdxSource}
        frontMatter={frontMatter}
      />
    </>
  )
}
