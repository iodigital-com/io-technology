import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { POSTS_PER_PAGE } from '../../articles'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import { getPagedContent } from '@/lib/hooks/useContentData'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import type { ContentItem } from '../../../types'
import type { PaginationMeta } from '../../../types/api'

export async function getStaticPaths() {
  const allPosts = await getAllFilesFrontMatter('blog')
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context: { params: { page: string } }) {
  const {
    params: { page },
  } = context
  const result = await getPagedContent('blog', parseInt(page), POSTS_PER_PAGE)
  return {
    props: {
      blog: result.posts,
      initialDisplayBlog: result.posts,
      pagination: result.pagination,
      authors: result.authors,
    },
  }
}

interface PostPageProps {
  blog: ContentItem[]
  initialDisplayBlog: ContentItem[]
  pagination: PaginationMeta
  authors: any // TODO: Fix AuthorsMap vs Author[] conflict
}

export default function PostPage({ blog, initialDisplayBlog, pagination, authors }: PostPageProps) {
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
