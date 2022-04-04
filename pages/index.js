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
              Let's discover <span className="font-serif">infinite opportunities</span> together
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
        {!posts.length && 'No posts found.'}
        {posts.slice(0, MAX_BLOG_POSTS).map((frontMatter) => {
          const { slug, date, title, summary, tags, image } = frontMatter
          return (
            <article key={slug} className="border-t border-gray-300 pt-6 pb-10">
              <div className="grid grid-cols-12">
                <div className="hidden md:col-span-3 md:block xl:col-span-5">
                  <div className="flex flex-col xl:flex-row">
                    <div className="flex-0 relative overflow-hidden rounded-full md:mb-4 md:h-16 md:w-16 xl:mr-7 xl:mb-0 xl:h-32 xl:w-32">
                      {frontMatter.authors.slice(0, 1).map((author) => {
                        return (
                          <Image
                            key={authors[author].name}
                            src={authors[author].avatar}
                            width={200}
                            height={200}
                            alt="avatar"
                            className="rounded-full"
                          />
                        )
                      })}
                    </div>
                    <div className="text-body-xs">
                      {frontMatter.authors.slice(0, 1).map((author) => {
                        return (
                          <>
                            <p className="mb-0">By {authors[author].name}</p>
                            <p className="mb-0">{authors[author].occupation}</p>
                          </>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="col-span-full md:col-start-4 xl:col-start-7">
                  <h2 className="text-2xl">
                    <Link href={`/blog/${slug}`}>{title}</Link>
                  </h2>
                  <dl className="mb-4">
                    <dt className="sr-only">Published on</dt>
                    <dd className="leading- text-sm font-light">
                      <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                  </dl>
                  <div className="mb-6 flex flex-wrap">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                  <Link href={`/blog/${slug}`}>
                    <Arrow className="w-6" />
                  </Link>
                </div>
              </div>
            </article>
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
