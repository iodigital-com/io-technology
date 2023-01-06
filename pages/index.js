import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getLatestVideos } from '@/lib/youtube'
import { getLatestJobs } from '@/lib/jobs'
import Image from '@/components/Image'
import JobGrid from '@/components/JobGrid'
import VideoCarousel from '@/components/VideoCarousel'
import { getAllAuthors } from '@/lib/authors'
import SectionTitle from '@/components/SectionTitle'
import Arrow from '@/data/arrow.svg'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import Article from '@/components/Article'
import Image1 from '../public/iO-technology-blog1.png'
import Image2 from '../public/iO-technology-blog2.png'
import ContributorsGrid from '@/components/ContributorsGrid'

const MAX_BLOG_POSTS = 5

export async function getStaticProps() {
  const posts = (await getAllFilesFrontMatter('blog')).filter(
    (frontMatter) => !frontMatter.hideInArticleList
  )
  const { videos } = await getLatestVideos(6)
  const { jobs } = await getLatestJobs(9)

  const contributors = (await getAllAuthors()).filter((author) => author.slug[0] !== 'default')

  return { props: { posts, videos, jobs, contributors, theme: 'orange' } }
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
      <div className={`bg-io_${theme}-500 text-white`}>
        <div className="pb-14 pt-24">
          <div className="container mx-auto grid grid-cols-12 gap-x-5">
            <h1 className="relative z-10 col-span-full text-4xl md:col-start-4 md:text-5xl xl:text-7xl">
              Is technology your window of{' '}
              <span className="font-serif font-light">infinite opportunity</span>?
            </h1>
            <div className="xl:-mt- col-span-full -mt-5 mb-12 flex md:col-span-10 md:mt-8 xl:col-span-7">
              <div className="w-1/2">
                <Image
                  alt="Illustration"
                  src={Image1}
                  width={2160}
                  height={2160}
                  layout="responsive"
                  sizes="(min-width: 768px) 20vw, 33vw"
                  priority={true}
                  placeholder="blur"
                />
              </div>
              <div className="w-1/2">
                <Image
                  alt="Illustration"
                  src={Image2}
                  width={2160}
                  height={2160}
                  layout="responsive"
                  sizes="(min-width: 768px) 20vw, 33vw"
                  priority={true}
                  placeholder="blur"
                  className="rounded-full"
                />
              </div>
            </div>
            <span className="col-span-full mb-6 md:col-start-7 md:mb-0 xl:col-start-8 xl:flex xl:items-center">
              <p className="text-lg">
                We are iO – a growing team of experts thriving on curiosity and explorers of all
                things <span className="font-serif">new and exciting</span>. As an end-to-end agency
                we <span className="font-serif">think big and work locally</span> in strategy,
                creation, content, marketing & technology - across every industry imaginable.
                Knowledge is the foundation of everything we undertake. Are you creative, curious
                and hungry for knowledge? Feed your mind.
              </p>
            </span>
            <ul className="col-span-full md:col-span-6 md:row-start-3 xl:col-span-3 xl:row-start-1">
              <li className="mb-4 flex items-center last:mb-0">
                <a href="#articles">Our latest articles</a>
                <Arrow className="mt-1 ml-2 rotate-90" />
              </li>
              <li className="mb-4 flex items-center last:mb-0">
                <a href="#videos">Our latest videos</a>
                <Arrow className="mt-1 ml-2 rotate-90" />
              </li>
              <li className="mb-4 flex items-center last:mb-0">
                <a href="#people">Our writers &amp; speakers</a>
                <Arrow className="mt-1 ml-2 rotate-90" />
              </li>
              <li className="mb-4 flex items-center last:mb-0">
                <a href="#jobs">Some of our jobs</a>
                <Arrow className="mt-1 ml-2 rotate-90" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <SectionTitle id="articles">
        Our latest <span className="font-serif font-light">articles</span>
      </SectionTitle>

      <section className="container mx-auto">
        {!posts.length && 'No articles found.'}
        {posts.slice(0, MAX_BLOG_POSTS).map((frontMatter, index) => {
          const { slug, date, title, tags } = frontMatter
          const authorsResolved = frontMatter.authors.map((author) => {
            return authors[author]
          })

          return (
            <Article
              key={slug}
              slug={slug}
              date={date}
              title={title}
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
