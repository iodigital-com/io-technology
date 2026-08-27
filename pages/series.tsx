import siteMetadata from '@/data/siteMetadata'
import SeriesLayout from '@/layouts/SeriesLayout'
import { PageSEO } from '@/components/SEO'
import { getContentWithPagination } from '@/lib/hooks/useContentData'
import type { ContentItem, AuthorsMap, PaginationMeta } from '../types'
import SearchLayout from '@/layouts/SearchLayout'
import HeroSection from '@/components/HeroSection'
import { usePostSearch } from '@/lib/hooks/usePostSearch'

export const SERIES_PER_PAGE = 10

export async function getStaticProps() {
  return getContentWithPagination('series', SERIES_PER_PAGE, 'blue', null, true)
}

interface SeriesProps {
  series: ContentItem[]
  initialDisplaySeries: ContentItem[]
  pagination: PaginationMeta
  authors: AuthorsMap
  transparentHeader: boolean
}

export default function Series({
  series,
  initialDisplaySeries,
  pagination,
  authors,
  transparentHeader,
}: SeriesProps) {
  const { searchValue, setSearchValue, filteredPosts } = usePostSearch(series)
  const displaySeries =
    initialDisplaySeries.length > 0 && !searchValue ? initialDisplaySeries : filteredPosts

  return (
    <>
      <PageSEO title={`Series - ${siteMetadata.author}`} description={siteMetadata.description} />
      <HeroSection title="Discover all series" isDarkBackground={transparentHeader}>
        <SearchLayout onChange={setSearchValue} searchPlaceholder="Search series" />
      </HeroSection>
      <SeriesLayout
        series={displaySeries}
        authors={authors}
        pagination={pagination}
        subpath="series"
        searchValue={searchValue}
      />
    </>
  )
}
