import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSEO } from '@/components/SEO'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTop from '@/components/ScrollTop'
import SocialIcon from '@/components/social-icons'

const postDateTemplate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

//TODO make component of hero

export default function PostLayout({ frontMatter, authorDetails, next, prev, children }) {
  const { slug, date, title, tags, image } = frontMatter

  return (
    <SectionContainer>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        authorDetails={authorDetails}
        {...frontMatter}
      />
      <ScrollTop />
      <article className="p-4 xl:p-16">
        <div>
          <header className="relative -mx-4 -mt-4 overflow-hidden xl:-mx-16 xl:-mt-16">
            <dl className="space-y-10">
              <div>
                <dt className="sr-only">Published on</dt>
                <dd className="text-right text-base font-medium leading-6"></dd>
              </div>
            </dl>
            {image && (
              <div className="header-image">
                <Image
                  src={image}
                  alt={title}
                  width={1200}
                  height={627}
                  objectFit="cover"
                  objectPosition="center"
                  layout="responsive"
                  priority={true}
                />
              </div>
            )}
            <div className="space-y-1 text-center">
              <div className="absolute bottom-0 w-full bg-black/[.2] p-10 text-right text-3xl font-bold leading-8">
                <h2 className="text-white">{title}</h2>
                <p>
                  <time className="text-sm text-white" dateTime={date}>
                    {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                  </time>
                </p>
              </div>
            </div>
          </header>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0"
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex justify-center space-x-8 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width="200px"
                          height="200px"
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
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
              <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-2 xl:pb-0">
                <div className="container prose mx-auto pt-10 pb-8 dark:prose-dark">{children}</div>
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
                        <div className="text-amber-600 hover:text-amber-700 dark:hover:text-primary-400">
                          <Link href={`/blog/${prev.slug}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Next Article
                        </h2>
                        <div className="text-amber-600 hover:text-amber-700 dark:hover:text-primary-400">
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
                  className="text-amber-600 hover:text-amber-700 dark:hover:text-primary-400"
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
