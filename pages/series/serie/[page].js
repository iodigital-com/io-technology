import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import SeriesLayout from '@/layouts/SeriesLayout'
import { SERIES_PER_PAGE } from '../../series'
import { getAuthors } from '@/lib/authors'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

export async function getStaticPaths() {
  const totalSeries = await getAllFilesFrontMatter('series')
  const totalPages = Math.ceil(totalSeries.length / SERIES_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const {
    params: { page },
  } = context
  const series = await getAllFilesFrontMatter('series')
  const pageNumber = parseInt(page)
  const initialDisplaySeries = series.slice(
    SERIES_PER_PAGE * (pageNumber - 1),
    SERIES_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(series.length / SERIES_PER_PAGE),
  }
  const authors = await getAuthors(series)

  return {
    props: {
      series,
      initialDisplaySeries,
      pagination,
      authors,
      theme: 'electric_blue',
    },
  }
}

export default function SeriesPage({ series, initialDisplaySeries, pagination, authors }) {
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
