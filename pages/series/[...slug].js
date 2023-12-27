import fs from 'fs'
import PageTitle from '@/components/PageTitle'
import generateRss from '@/lib/generate-rss'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx'
import { getLatestJobs } from '@/lib/jobs'
import { getSerie } from '@/lib/series'
import JobGrid from '@/components/JobGrid'
import path from 'path'

const root = process.cwd()
const DEFAULT_LAYOUT = 'SerieLayout'

export async function getStaticPaths() {
  const series = getFiles('series')
  return {
    paths: series.map((p) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allSeries = await getAllFilesFrontMatter('series')
  const allPosts = await getAllFilesFrontMatter('blog')
  const postIndex = allSeries.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
  const prev = allSeries[postIndex + 1] || null
  const next = allSeries[postIndex - 1] || null
  const serie = await getFileBySlug('series', params.slug.join('/'))
  const { posts = [] } = (await getSerie(params.slug.join('/'), allPosts)) || {}
  const authorList = serie.frontMatter.authors || ['default']
  const authorPromise = authorList.map(async (author) => {
    const authorResults = await getFileBySlug('authors', [author])
    return authorResults.frontMatter
  })
  const authorDetails = await Promise.all(authorPromise)

  // rss
  if (allSeries.length > 0) {
    const rss = await generateRss(allSeries, '/series/feed.xml')
    const rssPath = path.join(root, 'public', 'series')
    fs.mkdirSync(rssPath, { recursive: true })
    fs.writeFileSync('./public/series/feed.xml', rss)
  }

  const { jobs } = await getLatestJobs(4)

  const theme = serie.frontMatter.theme || 'blue'

  return { props: { serie, posts, authorDetails, prev, next, jobs, theme } }
}

export default function Serie({ posts, authorDetails, prev, next, jobs, serie }) {
  const { mdxSource, toc, frontMatter } = serie

  return (
    <>
      {frontMatter.draft !== true ? (
        <>
          <MDXLayoutRenderer
            layout={frontMatter.layout || DEFAULT_LAYOUT}
            toc={toc}
            mdxSource={mdxSource}
            frontMatter={frontMatter}
            authorDetails={authorDetails}
            prev={prev}
            next={next}
            serie={serie}
            posts={posts}
          />

          <div className="container mx-auto space-y-2 pt-6 pb-8 md:space-y-5">
            <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              Jobs
            </h2>
            <JobGrid jobs={jobs} />
          </div>
        </>
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
