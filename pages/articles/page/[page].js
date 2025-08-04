import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { POSTS_PER_PAGE } from '../../articles'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import { getPaginatedPaths, getPaginatedContent } from '@/lib/hooks/useContentData'

export async function getStaticPaths() {
  return getPaginatedPaths('blog', POSTS_PER_PAGE)
}

export async function getStaticProps(context) {
  const {
    params: { page },
  } = context
  return getPaginatedContent('blog', page, POSTS_PER_PAGE, 'beige')
}

export default function PostPage({ blog, initialDisplayBlog, pagination, authors }) {
  const { theme } = useBrandingTheme()

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <ListLayout
        posts={blog}
        initialDisplayPosts={initialDisplayBlog}
        pagination={pagination}
        title="All Posts"
        authors={authors}
        theme={theme}
      />
    </>
  )
}
