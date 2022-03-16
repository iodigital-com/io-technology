import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import { getLatestVideos } from '@/lib/youtube'
import Card from '@/components/Card'
import { getLatestJobs } from '@/lib/jobs'
import Image from '@/components/Image'
import JobGrid from '@/components/JobGrid'

const MAX_BLOG_POSTS = 5

async function getAuthors(posts) {
  const authors = await posts.map(async (post) => {
    const authorList = post.authors || ['default']

    const authorPromise = authorList.map(async (author) => {
      const authorResults = await getFileBySlug('authors', [author])
      const object = { [author]: authorResults.frontMatter }
      return object
    }, {})

    const authors = await Promise.all(authorPromise)
    return authors
  }, {})
  const authorsArray = await Promise.all(authors)

  return authorsArray.reduce((current, authorArray) => {
    const object = authorArray.reduce((curr, author) => ({ ...curr, ...author }))
    return { ...current, ...object }
  }, {})
}

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  let videos = []
  try {
    const { videos } = await getLatestVideos(3)
  } catch (e) {
    console.log('sada')
  }

  const { jobs } = await getLatestJobs(9)
  const authors = await getAuthors(posts)

  return { props: { posts, videos, jobs, authors } }
}

export default function Home({ posts, videos, jobs, authors }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="bg-io_blue-500 p-16 text-white">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="p-32 text-center text-3xl leading-9 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            <span>
              We have <i>infinite </i>insights to share
            </span>
          </h1>
        </div>
        {posts.slice(0, 1).map((frontMatter) => {
          const { slug, date, title, summary, tags, image } = frontMatter

          return (
            <article key={title} className="relative">
              {image && (
                <Image
                  src={image}
                  alt={title}
                  width={1200}
                  height={627}
                  layout="responsive"
                  priority={true}
                />
              )}
              <h2 className="absolute bottom-0 w-full bg-black/[.2] p-10 text-right text-3xl font-bold leading-8">
                <Link href={`/blog/${slug}`} className="">
                  {title}
                </Link>
                <p>
                  <time className="text-sm" dateTime={date}>
                    {formatDate(date)}
                  </time>
                </p>
              </h2>
              {frontMatter.authors.map((author) => {
                return (
                  <div key={authors[author].name} className="absolute top-10 right-10">
                    <Image
                      key={authors[author].name}
                      src={authors[author].avatar}
                      width="100px"
                      height="100px"
                      alt="avatar"
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                )
              })}
            </article>
          )
        })}
        <section className="grid grid-cols-3 gap-4">
          {!posts.length && 'No posts found.'}
          {posts.slice(1, MAX_BLOG_POSTS).map((frontMatter) => {
            const { slug, date, title, summary, tags, image } = frontMatter
            return (
              <article key={slug} className="py-12">
                <div className="space-y-2">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6">
                      <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                  </dl>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div className="flex justify-between">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link href={`/blog/${slug}`} className="">
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div>
                          {frontMatter.authors.map((author) => {
                            return (
                              <Image
                                key={authors[author].name}
                                src={authors[author].avatar}
                                width="50px"
                                height="50px"
                                alt="avatar"
                                className="h-10 w-10 rounded-full"
                              />
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        {image && (
                          <Image
                            src={image}
                            alt={title}
                            width={1200}
                            height={627}
                            layout="responsive"
                            priority={true}
                          />
                        )}
                      </div>
                      <div className="prose max-w-none text-white">{summary}</div>
                    </div>
                    <div className="text-base font-medium leading-6">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-white hover:text-io_orange-500"
                        aria-label={`Read "${title}"`}
                      >
                        Read more &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </div>
      {posts.length > MAX_BLOG_POSTS && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link href="/blog" className="" aria-label="all posts">
            All Posts &rarr;
          </Link>
        </div>
      )}

      <div className="divide-y divide-gray-200 p-16">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Videos
          </h1>
          <p className="text-lg leading-7 text-gray-500">{siteMetadata.description}</p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {videos.map((vid) => (
              <div key={vid.id} className="md p-4 md:w-1/3">
                <Card
                  title={vid.title}
                  description={vid.description}
                  imgSrc={vid.thumbnails.high.url}
                  unoptimized={true}
                  href={`/videos/${vid.id}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 p-16 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Jobs
        </h1>
      </div>
      <JobGrid jobs={jobs} />
    </>
  )
}
