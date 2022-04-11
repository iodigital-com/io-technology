import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import { getAuthors } from '@/lib/authors'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

export const POSTS_PER_PAGE = 10

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }
  const authors = await getAuthors(posts)

  return { props: { initialDisplayPosts, posts, pagination, authors, theme: 'rouge' } }
}

export default function Articles({ posts, initialDisplayPosts, pagination, authors }) {
  const { theme } = useBrandingTheme()

  return (
    <>
      <PageSEO title={`Articles - ${siteMetadata.author}`} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All articles"
        authors={authors}
        theme={theme}
      />
    </>
  )
}
