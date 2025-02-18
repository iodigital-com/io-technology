import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { formatSlug, getFileBySlug, getFiles } from '@/lib/mdx'
import { getPostsByAuthor, getTalksByAuthor, getWorkshopsByAuthor } from '@/lib/authors'

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
  const workshops = await getWorkshopsByAuthor(params.slug)

  return { props: { authorDetails, posts, talks, workshops } }
}

export default function Slug({ authorDetails, posts, talks, workshops }) {
  const { mdxSource, frontMatter } = authorDetails

  return (
    <MDXLayoutRenderer
      layout={'AuthorLayout'}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
      posts={posts}
      talks={talks}
      workshops={workshops}
    />
  )
}
