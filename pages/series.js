import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import SeriesLayout from '@/layouts/SeriesLayout'
import { PageSEO } from '@/components/SEO'
import { getAuthors } from '@/lib/authors'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

export const SERIES_PER_PAGE = 10

export async function getStaticProps() {
  const series = await getAllFilesFrontMatter('series')
  const initialDisplaySeries = series.slice(0, SERIES_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(series.length / SERIES_PER_PAGE),
  }
  const authors = await getAuthors(series)

  return {
    props: {
      initialDisplaySeries,
      series,
      pagination,
      authors,
      theme: 'blue',
    },
  }
}

export default function Series({ series, initialDisplaySeries, pagination, authors }) {
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
