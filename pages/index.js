import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getLatestVideos } from '@/lib/youtube'
import { getLatestJobs } from '@/lib/jobs'
import { getLatestEvents } from '@/lib/events'
import Image from '@/components/Image'
import JobGrid from '@/components/JobGrid'
import EventCarousel from '@/components/EventCarousel'
import VideoCarousel from '@/components/VideoCarousel'
import { getAllAuthors } from '@/lib/authors'
import SectionTitle from '@/components/SectionTitle'
import Arrow from '@/data/arrow.svg'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import Article from '@/components/Article'
import Image1 from '../public/iO-technology-blog1.png'
import Image2 from '../public/iO-technology-blog2.png'
import ContributorsGrid from '@/components/ContributorsGrid'
import shuffle from '@/lib/shuffle'

const MAX_BLOG_POSTS = 5

export async function getStaticProps() {
  const posts = (await getAllFilesFrontMatter('blog')).filter(
    (frontMatter) => !frontMatter.hideInArticleList
  )
  const { videos } = await getLatestVideos(10)
  const { jobs } = await getLatestJobs(9)
  const { events } = await getLatestEvents(9)

  const allAuthors = await getAllAuthors()
  const contributors = shuffle(allAuthors.filter((author) => author.slug[0] !== 'default'))

  return {
    props: { posts, videos, jobs, events, contributors, theme: 'green' },
  }
}

export default function Home({ posts, videos, jobs, events, contributors }) {
  const { theme } = useBrandingTheme()

  const authors = contributors.reduce((acc, author) => {
    acc[author.slug[0]] = author
    return acc
  }, {})

  const activeContributors = contributors.filter((contributor) => !contributor.archived)

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="relative min-h-screen">
        {/* Full-width/height background image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            alt="Hero Image"
            src={Image1}
            fill
            style={{ objectFit: 'cover' }}
            priority={true}
            placeholder="blur"
            sizes="100vw"
            className="brightness-75"
          />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 min-h-screen sm:min-h-screen sm:flex sm:flex-col md:min-h-screen lg:min-h-screen xl:min-h-screen max-sm:flex max-sm:flex-col-reverse max-sm:min-h-[calc(100vh-108px)]">
          <div className="container mx-auto h-full pt-24 pb-14">
            <div className="flex flex-col justify-center h-full">
              {/* Main content */}
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl xl:text-7xl mb-6 text-white drop-shadow-lg">
                  Is technology your window to{' '}
                  <span className="font-serif font-light">great experiences</span>?
                </h1>
                <p className="text-lg mb-8 text-white drop-shadow-lg max-w-xl">
                  We blend marketing, technology and creativity because we believe that creating the
                  ultimate customer experience requires a blend of these different skills to make an
                  impact on our clients' brand and business.
                </p>
                <button className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-colors w-fit">
                  View case →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionTitle id="articles">
        Our latest <span className="font-serif font-light">articles</span>
      </SectionTitle>

      <section className="container mx-auto">
        {!posts.length && 'No articles found.'}
        {posts.slice(0, MAX_BLOG_POSTS).map((frontMatter, index) => {
          const { slug, date, title, summary, tags } = frontMatter
          const authorsResolved = frontMatter.authors.map((author) => {
            return authors[author]
          })

          return (
            <Article
              key={slug}
              slug={slug}
              date={date}
              title={title}
              summary={summary}
              tags={tags}
              authors={authorsResolved}
              border={index !== 0}
            />
          )
        })}
      </section>

      {posts.length > MAX_BLOG_POSTS && (
        <div className="container mx-auto mt-5 flex justify-end">
          <Link
            href="/articles"
            aria-label="all posts"
            className="group relative inline-flex rounded-full bg-io_blue-600 px-9 py-4 text-base font-bold leading-none text-white transition-all delay-100"
          >
            <span>All Posts</span>
            <Arrow className="ml-3 w-5 transition-transform group-hover:translate-x-3" />
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
      <VideoCarousel videos={videos} />

      <SectionTitle id="events">
        Our latest <span className="font-serif font-light">events</span>
      </SectionTitle>
      <EventCarousel events={events} />

      <SectionTitle id="jobs">
        Some of our <span className="font-serif font-light">jobs</span>
      </SectionTitle>
      <div className="container mx-auto">
        <JobGrid jobs={jobs} />
      </div>
    </>
  )
}
