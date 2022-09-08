import MarkdownRenderer from 'react-markdown-renderer'
import removeMarkdown from 'markdown-to-text'
import Link from '@/components/Link'
import { BlogSEO } from '@/components/SEO'
import Image from '@/components/Image'
import Share from '@/components/Share'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTop from '@/components/ScrollTop'
import SocialIcon from '@/components/social-icons'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import formatDate from '@/lib/utils/formatDate'
import Arrow from '@/data/arrow.svg'
import Clock from '@/data/clock.svg'
import SeriePlaylist from '@/components/SeriePlaylist'

export default function PostLayout({ frontMatter, authorDetails, serie, next, prev, children }) {
  const { slug, date, title, tags, images, summary, readingTime } = frontMatter
  const { theme } = useBrandingTheme()

  return (
    <>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/articles/${slug}`}
        authorDetails={authorDetails}
        {...frontMatter}
      />
      <ScrollTop />
      <article>
        <div className={`bg-io_${theme}-500 mb-72 pb-14 pt-24 text-white`}>
          <div className="container mx-auto">
            <h1 className="heading-title text-4xl font-medium xl:text-7xl">
              {<MarkdownRenderer markdown={title} />}
            </h1>
            <div className="my-4 divide-x">
              {authorDetails.slice(0, 1).map((author) => {
                return (
                  <p key={author.name} className="inline pr-2 text-xl font-light">
                    By {author.name}
                  </p>
                )
              })}
              <time className="inline px-2 font-light" dateTime={date}>
                {formatDate(date)}
              </time>
              <p className="inline pl-2 font-light">
                <Clock className="mr-2 inline w-4" />
                {readingTime.text}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="col-span-full col-start-1 text-2xl md:col-start-2 xl:col-start-3">
                {summary}
              </p>
            </div>

            {images?.length > 0 && (
              <div className="-mt-20 translate-y-32 md:-mt-64 md:translate-y-72">
                <Image
                  src={images[0]}
                  alt={title}
                  width={1280}
                  height={720}
                  layout="responsive"
                  objectFit="cover"
                  priority={true}
                />
              </div>
            )}
          </div>
        </div>

        <div
          className="container mx-auto pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0"
          style={{ gridTemplateRows: 'auto 1fr' }}
        >
          <dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
            <dt className="sr-only">Authors</dt>
            <dd>
              <ul className="flex justify-center space-x-8 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                {authorDetails.map((author) => (
                  <li className="flex items-center space-x-4" key={author.name}>
                    {author.avatar && (
                      <Image
                        src={author.avatar}
                        width="100px"
                        height="100px"
                        alt="avatar"
                        className="flex-grow-0 rounded-full"
                      />
                    )}
                    <dl className="whitespace-nowrap text-sm font-medium leading-7">
                      <dt className="sr-only">Name</dt>
                      <dd className="text-gray-900 dark:text-gray-100">
                        <Link>
                          <a
                            href={`/authors/${author.slug[0]}`}
                            className={`text-io_${theme}-600 hover:text-io_${theme}-700 text-lg`}
                          >
                            {author.name}
                          </a>
                        </Link>
                      </dd>

                      {author.linkedin && (
                        <>
                          <dt className="sr-only">LinkedIn</dt>
                          <dd>
                            <SocialIcon kind="linkedin" href={author.linkedin} size="5">
                              {author.name}
                            </SocialIcon>
                          </dd>
                        </>
                      )}
                      {author.twitter && (
                        <>
                          <dt className="sr-only">Twitter</dt>
                          <dd>
                            <SocialIcon kind="twitter" href={author.twitter} size="5">
                              {author.twitter.replace('https://twitter.com/', '@')}
                            </SocialIcon>
                          </dd>
                        </>
                      )}
                      {author.github && (
                        <>
                          <dt className="sr-only">Github</dt>
                          <dd>
                            <SocialIcon kind="github" href={author.github} size="5">
                              {author.github.replace('https://github.com/', '')}
                            </SocialIcon>
                          </dd>
                        </>
                      )}
                      {author.website && (
                        <>
                          <dt className="sr-only">Website</dt>
                          <dd>
                            <SocialIcon kind="website" href={author.website} size="5">
                              Blog
                            </SocialIcon>
                          </dd>
                        </>
                      )}
                    </dl>
                  </li>
                ))}
              </ul>

              {serie && (
                <div className="pt-8 xl:hidden">
                  <h2 className="mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Part of series
                  </h2>
                  <SeriePlaylist serie={serie} />
                </div>
              )}
            </dd>
          </dl>
          <div className="xl:col-span-3 xl:row-span-3 xl:grid xl:grid-cols-3">
            <div className="xl:col-span-2 xl:pb-0">
              <div className="container prose mx-auto pt-10 pb-8 dark:prose-dark ">
                {children}
                <div>
                  <hr className="my-24" />
                  <h1>Share</h1>
                  <Share />
                </div>
              </div>
            </div>
          </div>
          <footer>
            <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
              {tags && (
                <div className="py-4 xl:py-8">
                  <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Tags
                  </h2>
                  <div className="mt-2 flex flex-wrap">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
              )}
              {!serie && (next || prev) && (
                <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                  {prev && (
                    <div>
                      <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Previous Article
                      </h2>
                      <div
                        className={`text-io_${theme}-600 hover:text-io_${theme}-700 dark:hover:text-primary-400`}
                      >
                        <Link href={`/articles/${prev.slug}`}>{removeMarkdown(prev.title)}</Link>
                      </div>
                    </div>
                  )}
                  {next && (
                    <div>
                      <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Next Article
                      </h2>
                      <div
                        className={`text-io_${theme}-600 hover:text-io_${theme}-700 dark:hover:text-primary-400`}
                      >
                        <Link href={`/articles/${next.slug}`}>{removeMarkdown(next.title)}</Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {serie && (
                <div className="py-4 xl:py-8">
                  <h2 className="mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Part of series
                  </h2>
                  <SeriePlaylist serie={serie} />
                </div>
              )}
            </div>
            <div className="pt-4 xl:pt-8">
              <Link
                href="/articles"
                className={`relative inline-flex rounded-full border border-black py-4 px-9 text-base font-bold leading-none transition-colors delay-100 hover:bg-black hover:text-white`}
              >
                <Arrow className="mr-4 w-6 rotate-180" /> Back to all articles
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </>
  )
}
