import fs from 'fs'
import PageTitle from '@/components/PageTitle'
import generateRss from '@/lib/generate-rss'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx'
import { getAuthors } from '@/lib/authors'
import { getRelatedJobs } from '@/lib/jobs'
import { getLatestEvents } from '@/lib/events'
import { getSerie } from '@/lib/series'
import JobGrid from '@/components/JobGrid'
import type { ContentItem, Event, Author } from '../../types'
import type { Job } from '../../lib/jobs/types'
import type { MDXContent } from '../../lib/mdx/types'
import type { SerieData } from '../../lib/series/types'

const DEFAULT_LAYOUT = 'PostLayout'

export async function getStaticPaths() {
  const posts = getFiles('blog')
  return {
    paths: posts.map((p) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { slug: string[] } }) {
  const allPosts = await getAllFilesFrontMatter('blog')
  const postIndex = allPosts.findIndex(
    (post) => formatSlug(post.slug || '') === (params.slug || []).join('/')
  )
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getFileBySlug('blog', (params.slug || []).join('/'))
  // Get properly processed author objects with correct slug format
  const authorDetails = Object.values(await getAuthors([post.frontMatter]))
  const serie = post.frontMatter.serie
    ? await getSerie(post.frontMatter.serie as string, allPosts)
    : null

  // rss
  if (allPosts.length > 0) {
    const rss = await generateRss(allPosts)
    fs.writeFileSync('./public/feed.xml', rss)
  }

  const searchString = authorDetails.reduce(
    (acc: string, author) => acc + (author.occupation || '') + ' ',
    ''
  )
  const jobs = await getRelatedJobs(4, searchString)

  const { events } = await getLatestEvents(3)

  const theme = post.frontMatter.theme || 'blue'
  const transparentHeader = !!(post.frontMatter.images && post.frontMatter.images.length > 0)

  return {
    props: {
      post,
      authorDetails,
      prev,
      next,
      jobs,
      events,
      serie,
      theme,
      transparentHeader,
    },
  }
}

interface BlogProps {
  post: MDXContent
  authorDetails: Author[]
  prev: ContentItem | null
  next: ContentItem | null
  jobs: Job[]
  events: Event[]
  serie: SerieData | null
}

export default function Blog({ post, authorDetails, prev, next, jobs, events, serie }: BlogProps) {
  const { mdxSource, toc, frontMatter } = post

  return (
    <>
      {frontMatter.draft !== true ? (
        <>
          <MDXLayoutRenderer
            layout={(frontMatter.layout as string) || DEFAULT_LAYOUT}
            toc={toc}
            mdxSource={mdxSource}
            frontMatter={frontMatter}
            authorDetails={authorDetails}
            prev={prev}
            next={next}
            serie={serie}
            events={events}
            contactForm={frontMatter.contactForm}
          />

          <div className="container mx-auto space-y-2 pb-8 pt-6 md:space-y-5">
            <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              Jobs
            </h2>
            <JobGrid jobs={jobs} />
          </div>
        </>
      ) : (
        <div className="mt-24 text-center">
          <PageTitle className="">
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
