import Link from '@/components/Link'
import { BlogSEO } from '@/components/SEO'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTop from '@/components/ScrollTop'
import SocialIcon from '@/components/social-icons'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import formatDate from '@/lib/utils/formatDate'

export default function PostLayout({ frontMatter, authorDetails, next, prev, children }) {
  const { slug, date, title, tags, image } = frontMatter
  const { theme } = useBrandingTheme()

  return (
    <>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        authorDetails={authorDetails}
        {...frontMatter}
      />
      <ScrollTop />
      <article>
        <div className={`bg-io_${theme}-500 mb-72 pb-14 pt-24 text-white`}>
          <div className="container mx-auto">
            <h1 className="text-4xl font-medium xl:text-7xl">{title}</h1>
            <div className="mb-4 divide-x">
              {authorDetails.slice(0, 1).map((author) => {
                return (
                  <p key={author.name} className="inline pr-2 text-xl font-light">
                    By {author.name}
                  </p>
                )
              })}
              <time className="inline pl-2 text-xl font-light" dateTime={date}>
                {formatDate(date)}
              </time>
            </div>
            {image && (
              <div className="-mt-64 translate-y-72">
                <Image
                  src={image}
                  alt={title}
                  width={1200}
                  height={627}
                  layout="responsive"
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
                      <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
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
            </dd>
          </dl>
          <div className="xl:col-span-3 xl:row-span-3 xl:grid xl:grid-cols-3">
            <div className="xl:col-span-2 xl:pb-0">
              <div className="container prose mx-auto pt-10 pb-8 dark:prose-dark ">{children}</div>
            </div>
          </div>
          <footer>
            <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
              {tags && (
                <div className="py-4 xl:py-8">
                  <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Tags
                  </h2>
                  <div className="flex flex-wrap">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
              )}
              {(next || prev) && (
                <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                  {prev && (
                    <div>
                      <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Previous Article
                      </h2>
                      <div
                        className={`text-io_${theme}-600 hover:text-io_${theme}-700 dark:hover:text-primary-400`}
                      >
                        <Link href={`/blog/${prev.slug}`}>{prev.title}</Link>
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
                        <Link href={`/blog/${next.slug}`}>{next.title}</Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="pt-4 xl:pt-8">
              <Link
                href="/blog"
                className={`text-io_${theme}-600 hover:text-io_${theme}-700 dark:hover:text-primary-400`}
              >
                &larr; Back to the blog
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </>
  )
}
