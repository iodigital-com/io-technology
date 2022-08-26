import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { formatSlug, getFileBySlug, getFiles } from '@/lib/mdx'

export async function getStaticPaths() {
  const authors = getFiles('authors')

  return {
    paths: authors.map((author) => ({ params: { slug: formatSlug(author) } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const authorDetails = await getFileBySlug('authors', [params.slug])
  return { props: { authorDetails } }
}

export default function Slug({ authorDetails }) {
  const { mdxSource, frontMatter } = authorDetails

  return (
    <MDXLayoutRenderer layout={'AuthorLayout'} mdxSource={mdxSource} frontMatter={frontMatter} />
  )
}
