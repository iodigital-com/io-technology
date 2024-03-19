import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getLatestVideos } from '@/lib/youtube'
import { getLatestJobs } from '@/lib/jobs'
import JobGrid from '@/components/JobGrid'
import VideoCarousel from '@/components/VideoCarousel'
import { getAllAuthors } from '@/lib/authors'
import SectionTitle from '@/components/SectionTitle'
import Arrow from '@/data/arrow.svg'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import Article from '@/components/Article'
import ArticlePrimary from '@/components/ArticlePrimary'
import ContributorsGrid from '@/components/ContributorsGrid'
import shuffle from '@/lib/shuffle'
import BackgroundVideo from 'public/videos/i-twist-green_16x9-rechts.mp4'

const MAX_BLOG_POSTS = 5

export async function getStaticProps() {
  const posts = (await getAllFilesFrontMatter('blog')).filter(
    (frontMatter) => !frontMatter.hideInArticleList
  )
  const { videos } = await getLatestVideos(10)
  const { jobs } = await getLatestJobs(9)

  const allAuthors = await getAllAuthors()
  const contributors = shuffle(allAuthors.filter((author) => author.slug[0] !== 'default'))

  return { props: { posts, videos, jobs, contributors, theme: 'green' } }
}

export default function Home({ posts, videos, jobs, contributors }) {
  const { theme } = useBrandingTheme()

  const authors = contributors.reduce((acc, author) => {
    acc[author.slug[0]] = author
    return acc
  }, {})

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className={`bg-io_${theme}-500 relative`}>
        <div className="absolute top-0 right-0 bottom-0 left-0">
          <video className="h-full w-full object-cover" autoPlay loop>
            <source src={BackgroundVideo} type="video/mp4" />
          </video>
        </div>
        <section className="pb-14 pt-24">
          {posts.length &&
            posts.slice(0, 1).map((firstArticle) => {
              const { slug, title, summary } = firstArticle
              const authorsResolved = firstArticle.authors.map((author) => {
                return authors[author]
              })

              return (
                <ArticlePrimary
                  key={slug}
                  slug={slug}
                  title={title}
                  summary={summary}
                  authors={authorsResolved}
                />
              )
            })}
        </section>
      </div>

      <SectionTitle id="articles">
        More <span className="font-serif font-light">articles</span>
      </SectionTitle>

      <section className="container mx-auto">
        {!posts.length && 'No articles found.'}
        {posts.slice(1, MAX_BLOG_POSTS).map((frontMatter, index) => {
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
            className="relative inline-flex rounded-full border border-black py-4 px-9 text-base font-bold leading-none transition-colors delay-100 hover:bg-black hover:text-white"
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
        <ContributorsGrid contributors={contributors} />
      </div>

      <SectionTitle id="videos">
        Our latest <span className="font-serif font-light">videos</span>
      </SectionTitle>
      <VideoCarousel videos={videos} />

      <SectionTitle id="jobs">
        Some of our <span className="font-serif font-light">jobs</span>
      </SectionTitle>
      <div className="container mx-auto">
        <JobGrid jobs={jobs} />
      </div>
    </>
  )
}
