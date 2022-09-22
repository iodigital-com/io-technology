import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { formatSlug, getFileBySlug, getFiles } from '@/lib/mdx'
import { getPostsByAuthor, getTalksByAuthor } from '@/lib/authors'

export async function getStaticPaths() {
  const authors = getFiles('authors')

  return {
    paths: authors.map((author) => ({ params: { slug: formatSlug(author) } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const authorDetails = await getFileBySlug('authors', [params.slug])
  const posts = await getPostsByAuthor(params.slug)
  const talks = await getTalksByAuthor(params.slug)

  return { props: { authorDetails, posts, talks } }
}

export default function Slug({ authorDetails, posts, talks }) {
  const { mdxSource, frontMatter } = authorDetails

  return (
    <MDXLayoutRenderer
      layout={'AuthorLayout'}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
      posts={posts}
      talks={talks}
    />
  )
}
