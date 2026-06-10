import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import HeroSection from '@/components/HeroSection'
import { POSTS_PER_PAGE } from '../../articles'
import { getPagedContent } from '@/lib/hooks/useContentData'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import type { ContentItem, AuthorsMap } from '../../../types'
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
  pagination: PaginationMeta
  authors: AuthorsMap
}

export default function PostPage({ blog, pagination, authors }: PostPageProps) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <HeroSection title="All Posts" />
      <ListLayout posts={blog} authors={authors} pagination={pagination} subpath="articles" />
    </>
  )
}
