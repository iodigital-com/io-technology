import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import SeriesLayout from '@/layouts/SeriesLayout'
import { SERIES_PER_PAGE } from '../../series'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import { getPaginatedPaths, getPaginatedContent } from '@/lib/hooks/useContentData'

export async function getStaticPaths() {
  return getPaginatedPaths('series', SERIES_PER_PAGE)
}

export async function getStaticProps(context) {
  const {
    params: { page },
  } = context
  return getPaginatedContent('series', page, SERIES_PER_PAGE, 'blue')
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
