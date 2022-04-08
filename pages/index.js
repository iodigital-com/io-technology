import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import { getLatestVideos } from '@/lib/youtube'
import { getLatestJobs } from '@/lib/jobs'
import Image from '@/components/Image'
import JobGrid from '@/components/JobGrid'
import VideoCarousel from '@/components/VideoCarousel'
import { getAuthors } from '@/lib/authors'
import SectionTitle from '@/components/SectionTitle'
import Arrow from '@/data/arrow.svg'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import Article from '@/components/Article'

const MAX_BLOG_POSTS = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  const { videos } = await getLatestVideos(6)
  const { jobs } = await getLatestJobs(9)
  const authors = await getAuthors(posts)

  return { props: { posts, videos, jobs, authors, theme: 'orange' } }
}

export default function Home({ posts, videos, jobs, authors }) {
  const { theme } = useBrandingTheme()

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className={`bg-io_${theme}-500 text-white`}>
        <div className="pb-14 pt-24">
          <div className="container mx-auto grid grid-cols-12 gap-x-5">
            <h1 className="relative z-10 col-span-full text-4xl md:col-start-4 md:text-5xl xl:text-7xl">
              Is technology your window of <span className="font-serif">infinite opportunity</span>?
            </h1>
            <div className="xl:-mt- col-span-full -mt-5 mb-12 flex md:col-span-10 md:-mt-6 xl:col-span-7">
              <div className="w-1/2">
                <Image src={'/home2.avif'} width={1200} height={1200} layout="responsive" />
              </div>
              <div className="w-1/2">
                <Image
                  src={'/home1.avif'}
                  width={1200}
                  height={1200}
                  layout="responsive"
                  className="rounded-full"
                />
              </div>
            </div>
            <span className="col-span-full mb-6 md:col-start-7 md:mb-0 xl:col-start-8 xl:flex xl:items-center">
              <div className="RichText_root__3OHW3">
                <p>
                  iO is an end-to-end agency designing and executing solutions for the strategic,
                  creative, digital &amp; marketing needs of today and tomorrow. We not only help
                  clients to achieve their business objectives, together we discover and exploit the
                  endless possibilities –&nbsp;
                  <i>infinite opportunities</i>&nbsp;– that a constantly changing market offers.
                </p>
              </div>
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
                <a href="#jobs">Some of our jobs</a>
                <Arrow className="mt-1 ml-2 rotate-90" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <SectionTitle id="articles">
        Our latest <span className="font-serif">articles</span>
      </SectionTitle>

      <section className="container mx-auto">
        {!posts.length && 'No articles found.'}
        {posts.slice(0, MAX_BLOG_POSTS).map((frontMatter) => {
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
            />
          )
        })}
      </section>

      {posts.length > MAX_BLOG_POSTS && (
        <div className="container mx-auto flex justify-end text-xl font-medium leading-6">
          <Link href="/blog" aria-label="all posts">
            All Posts &rarr;
          </Link>
        </div>
      )}

      <SectionTitle id="videos">
        Our latest <span className="font-serif">videos</span>
      </SectionTitle>
      <VideoCarousel videos={videos} />

      <SectionTitle id="jobs">
        Some of our <span className="font-serif">jobs</span>
      </SectionTitle>
      <div className="container mx-auto">
        <JobGrid jobs={jobs} />
      </div>
    </>
  )
}
