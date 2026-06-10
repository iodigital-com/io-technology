import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getLatestVideos } from '@/lib/youtube'
import { getLatestJobs } from '@/lib/jobs'
import { getLatestEvents } from '@/lib/events'
import JobGrid from '@/components/JobGrid'
import EventCarousel from '@/components/EventCarousel'
import VideoCarousel from '@/components/VideoCarousel'
import { getAllAuthors } from '@/lib/authors'
import SectionTitle from '@/components/SectionTitle'
import Arrow from '@/data/arrow.svg'
import HeroSection from '@/components/HeroSection'
import ContentCard from '@/components/ContentCard'
import ContributorsGrid from '@/components/ContributorsGrid'
import shuffle from '@/lib/shuffle'
import type { FrontMatter, Author } from '../types'
import type { GetStaticProps } from 'next'

const MAX_BLOG_POSTS = 6

// Local type for authors mapping
type AuthorsFrontMatter = Record<string, Author>

// Flexible API response types that accommodate actual API structures
interface FlexibleVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  channelId: string
  channelTitle: string
  thumbnails: Record<string, { url: string; width: number; height: number }>
  [key: string]: unknown
}

interface FlexibleJob {
  id: string
  title: string
  published_at: string
  [key: string]: unknown // Allow for flexible structure
}

interface FlexibleEvent {
  title: string
  dateTime: string
  eventUrl: string
  [key: string]: unknown // Allow for flexible structure
}

interface HomeProps {
  posts: FrontMatter[]
  videos: FlexibleVideo[]
  jobs: FlexibleJob[]
  events: FlexibleEvent[]
  contributors: Author[]
  theme: string
  transparentHeader: boolean
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const posts = (await getAllFilesFrontMatter('blog')).filter(
    (frontMatter) => !frontMatter.hideInArticleList
  )
  const { videos } = await getLatestVideos(10)
  const { jobs } = await getLatestJobs(9)
  const { events } = await getLatestEvents(9)

  const allAuthors = await getAllAuthors()
  // Add defensive check to ensure allAuthors is an array
  const authorsArray = Array.isArray(allAuthors) ? allAuthors : []
  const contributors = shuffle(
    authorsArray.filter((author) => author.slug && author.slug[0] !== 'default')
  )

  return {
    props: {
      posts,
      videos: videos as unknown as FlexibleVideo[],
      jobs: jobs as unknown as FlexibleJob[],
      events: events as unknown as FlexibleEvent[],
      contributors,
      theme: 'green',
      transparentHeader: true,
    },
  }
}

export default function Home({
  posts,
  videos,
  jobs,
  events,
  contributors,
  transparentHeader,
}: HomeProps) {
  const authors: AuthorsFrontMatter = contributors.reduce((acc: AuthorsFrontMatter, author) => {
    acc[author.slug?.[0] || ''] = author
    return acc
  }, {})

  const activeContributors = contributors.filter((contributor) => !contributor.archived)

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <HeroSection
        title="Is technology your window to great experiences?"
        description="We blend marketing, technology and creativity because we believe that creating the ultimate customer experience requires a blend of these different skills to make an impact on our clients' brand and business."
        isDarkBackground={transparentHeader}
      >
        <ul
          className={`col-span-full mt-10 lg:mt-16 md:col-span-8 ${
            transparentHeader ? 'text-white' : ''
          }`}
        >
          <li className="mb-4 flex items-center last:mb-0">
            <Link href="#articles" className="font-bold">
              Our latest articles
            </Link>
            <Arrow className="ml-2 mt-1 rotate-90" />
          </li>
          <li className="mb-4 flex items-center last:mb-0">
            <Link href="#videos" className="font-bold">
              Our latest videos
            </Link>
            <Arrow className="ml-2 mt-1 rotate-90" />
          </li>
          <li className="mb-4 flex items-center last:mb-0">
            <Link href="#people" className="font-bold">
              Our writers &amp; speakers
            </Link>
            <Arrow className="ml-2 mt-1 rotate-90" />
          </li>
          <li className="mb-4 flex items-center last:mb-0">
            <Link href="#jobs" className="font-bold">
              Some of our jobs
            </Link>
            <Arrow className="ml-2 mt-1 rotate-90" />
          </li>
        </ul>
      </HeroSection>

      <SectionTitle id="articles">
        Our latest <span className="font-serif font-light">articles</span>
      </SectionTitle>

      <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {!posts.length && 'No articles found.'}
        {posts.slice(0, MAX_BLOG_POSTS).map((frontMatter, index) => {
          const { slug, date, title, summary, tags, images } = frontMatter
          const authorsResolved = frontMatter.authors
            .map((author) => {
              return authors[author]
            })
            .filter((author): author is typeof author & {} => Boolean(author))

          // Ensure required fields are not null
          if (!slug || !date) {
            return null
          }

          return (
            <ContentCard
              key={slug}
              slug={slug}
              date={date}
              title={title}
              summary={summary}
              tags={tags}
              authors={authorsResolved}
              border={index !== 0}
              type="article"
              {...(images && { images })}
            />
          )
        })}
      </section>

      {posts.length > MAX_BLOG_POSTS && (
        <div className="container mx-auto mt-5 flex justify-end">
          <Link
            href="/articles"
            aria-label="all posts"
            className="relative inline-flex rounded-full border border-black px-9 py-4 text-base font-bold leading-none transition-colors delay-100 hover:bg-black hover:text-white"
          >
            <span>All Posts</span>
            <Arrow className="ml-4 w-6" />
          </Link>
        </div>
      )}

      <SectionTitle id="people">
        Our amazing <br />
        <span className="font-serif font-light">writers</span> &amp;{' '}
        <span className="font-serif font-light">speakers</span>
      </SectionTitle>
      <div className="container mx-auto mt-8">
        <ContributorsGrid contributors={activeContributors} />
      </div>

      <SectionTitle id="videos">
        Our latest <span className="font-serif font-light">videos</span>
      </SectionTitle>
      <VideoCarousel videos={videos as unknown as never[]} />

      <SectionTitle id="events">
        Our latest <span className="font-serif font-light">events</span>
      </SectionTitle>
      <EventCarousel events={events as unknown as any[]} />

      <SectionTitle id="jobs">
        Some of our <span className="font-serif font-light">jobs</span>
      </SectionTitle>
      <div className="container mx-auto">
        <JobGrid jobs={jobs as unknown as never[]} />
      </div>
    </>
  )
}
