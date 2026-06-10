import siteMetadata from '@/data/siteMetadata'
import SeriesLayout from '@/layouts/SeriesLayout'
import { PageSEO } from '@/components/SEO'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import { getContentWithPagination } from '@/lib/hooks/useContentData'
import type { ContentItem, AuthorsMap, PaginationMeta } from '../types'

export const SERIES_PER_PAGE = 10

export async function getStaticProps() {
  return getContentWithPagination('series', SERIES_PER_PAGE, 'blue', null, false)
}

interface SeriesProps {
  series: ContentItem[]
  initialDisplaySeries: ContentItem[]
  pagination: PaginationMeta
  authors: AuthorsMap
}

export default function Series({ series, initialDisplaySeries, pagination, authors }: SeriesProps) {
  const { theme } = useBrandingTheme()

  return (
    <>
      <PageSEO title={`Series - ${siteMetadata.author}`} description={siteMetadata.description} />
      <SeriesLayout
        series={series}
        authors={authors}
        initialDisplaySeries={initialDisplaySeries}
        pagination={pagination}
        title="Discover all series"
        theme={theme}
      />
    </>
  )
}
