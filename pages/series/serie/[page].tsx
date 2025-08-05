import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import SeriesLayout from '@/layouts/SeriesLayout'
import { SERIES_PER_PAGE } from '../../series'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import { getPagedContent } from '@/lib/hooks/useContentData'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import type { ContentItem } from '../../../types'
import type { PaginationMeta } from '../../../types/api'

export async function getStaticPaths() {
  const allSeries = await getAllFilesFrontMatter('series')
  const totalPages = Math.ceil(allSeries.length / SERIES_PER_PAGE)
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
  const result = await getPagedContent('series', parseInt(page), SERIES_PER_PAGE)
  return {
    props: {
      series: result.posts,
      initialDisplaySeries: result.posts,
      pagination: result.pagination,
      authors: result.authors,
    },
  }
}

interface SeriesPageProps {
  series: ContentItem[]
  initialDisplaySeries: ContentItem[]
  pagination: PaginationMeta
  authors: any // TODO: Fix AuthorsMap vs Author[] conflict
}

export default function SeriesPage({
  series,
  initialDisplaySeries,
  pagination,
  authors,
}: SeriesPageProps) {
  const { theme } = useBrandingTheme()

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <SeriesLayout
        series={series}
        initialDisplaySeries={initialDisplaySeries}
        pagination={pagination}
        title="All Series"
        authors={authors}
        theme={theme}
      />
    </>
  )
}
