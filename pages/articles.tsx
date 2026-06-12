import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import { getContentWithPagination } from '@/lib/hooks/useContentData'
import type { ContentItem, AuthorsMap, PaginationMeta } from '../types'
import PromoCardBg from '../public/Insights_nieuwsbrief.png'

export const POSTS_PER_PAGE = 12

export async function getStaticProps() {
  return getContentWithPagination(
    'blog',
    POSTS_PER_PAGE,
    'beige',
    (frontMatter: ContentItem) => !frontMatter.hideInArticleList
  )
}

interface ArticlesProps {
  blog: ContentItem[]
  initialDisplayBlog: ContentItem[]
  pagination: PaginationMeta
  authors: AuthorsMap
}

export default function Articles({ blog, initialDisplayBlog, pagination, authors }: ArticlesProps) {
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
        promoCard={{
          index: 5,
          title: 'Find your career with infinite opportunities',
          ctaText: 'View our tech jobs',
          ctaHref: 'https://www.iodigital.com/en/careers/jobs?expertise=Technology',
          image: PromoCardBg.src,
        }}
      />
    </>
  )
}
