import siteMetadata from '@/data/siteMetadata'
import SearchLayout from '@/layouts/SearchLayout'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import HeroSection from '@/components/HeroSection'
import { getContentWithPagination } from '@/lib/hooks/useContentData'
import type { ContentItem, AuthorsMap, PaginationMeta } from '../types'
import { usePostSearch } from '@/lib/hooks/usePostSearch'

export const POSTS_PER_PAGE = 12

export async function getStaticProps() {
  return getContentWithPagination(
    'blog',
    POSTS_PER_PAGE,
    'beige',
    (frontMatter: ContentItem) => !frontMatter.hideInArticleList,
    true
  )
}

interface ArticlesProps {
  blog: ContentItem[]
  initialDisplayBlog: ContentItem[]
  pagination: PaginationMeta
  authors: AuthorsMap
}

export default function Articles({ blog, initialDisplayBlog, pagination, authors }: ArticlesProps) {
  const { searchValue, setSearchValue, filteredPosts } = usePostSearch(blog)

  const displayPosts =
    initialDisplayBlog.length > 0 && !searchValue ? initialDisplayBlog : filteredPosts

  return (
    <>
      <PageSEO title={`Articles - ${siteMetadata.author}`} description={siteMetadata.description} />
      <HeroSection title="Discover all articles">
        <SearchLayout onChange={setSearchValue} searchPlaceholder="Search articles" />
      </HeroSection>
      <ListLayout
        posts={displayPosts}
        authors={authors}
        pagination={pagination}
        subpath="articles"
        searchValue={searchValue}
      />
    </>
  )
}
