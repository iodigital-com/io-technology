import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import { getContentWithPagination } from '@/lib/hooks/useContentData'

export const POSTS_PER_PAGE = 10

export async function getStaticProps() {
  return getContentWithPagination(
    'blog',
    POSTS_PER_PAGE,
    'beige',
    (frontMatter) => !frontMatter.hideInArticleList
  )
}

export default function Articles({ blog, initialDisplayBlog, pagination, authors }) {
  const { theme } = useBrandingTheme()

  return (
    <>
      <PageSEO title={`Articles - ${siteMetadata.author}`} description={siteMetadata.description} />
      <ListLayout
        posts={blog}
        initialDisplayPosts={initialDisplayBlog}
        pagination={pagination}
        title="Discover all articles"
        authors={authors}
        theme={theme}
      />
    </>
  )
}
