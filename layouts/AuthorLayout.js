import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { PageSEO } from '@/components/SEO'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import Article from '@/components/Article'
import SectionTitle from '@/components/SectionTitle'
import Talk from '@/components/Talk'

export default function AuthorLayout({ children, frontMatter, posts, talks }) {
  const { name, avatar, occupation, twitter, linkedin, github, website } = frontMatter

  const { theme } = useBrandingTheme()
  const textClass = theme === 'default' ? 'text-black' : 'text-white'

  return (
    <>
      <PageSEO title={`Author - ${name}`} description={`About me - ${name}`} />

      <section className={`bg-io_${theme}-500 ${textClass}`}>
        <div className="container mx-auto pt-8 pb-12">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-4 md:mb-0 xl:col-start-9 xl:row-start-1">
              <Image
                src={avatar}
                width={800}
                height={800}
                layout="responsive"
                className="rounded-full"
                alt="avatar"
              />
            </div>

            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mt-4 md:mb-10 xl:row-start-1 xl:mt-12 xl:mb-16">
              <h1 className="mb-2 text-4xl md:text-5xl xl:text-7xl">{name}</h1>
              <p className="mb-4 text-2xl">{occupation}</p>
              <div className="flex flex-wrap gap-4">
                {linkedin && (
                  <>
                    <dt className="sr-only">LinkedIn</dt>
                    <dd>
                      <SocialIcon kind="linkedin" href={linkedin} size="5">
                        {name}
                      </SocialIcon>
                    </dd>
                  </>
                )}
                {twitter && (
                  <>
                    <dt className="sr-only">Twitter</dt>
                    <dd>
                      <SocialIcon kind="twitter" href={twitter} size="5">
                        {twitter.replace('https://twitter.com/', '@')}
                      </SocialIcon>
                    </dd>
                  </>
                )}
                {github && (
                  <>
                    <dt className="sr-only">Github</dt>
                    <dd>
                      <SocialIcon kind="github" href={github} size="5">
                        {github.replace('https://github.com/', '')}
                      </SocialIcon>
                    </dd>
                  </>
                )}
                {website && (
                  <>
                    <dt className="sr-only">Website</dt>
                    <dd>
                      <SocialIcon kind="website" href={website} size="5">
                        {website.replace('https://', '').replace('/', '')}
                      </SocialIcon>
                    </dd>
                  </>
                )}
              </div>
              <div className="prose mt-4">{children}</div>
            </div>
          </div>
        </div>
      </section>

      {posts.length && (
        <>
          <SectionTitle>
            Articles by <span className="font-serif font-light">{name}</span>
          </SectionTitle>
          <section className="container mx-auto max-w-2xl">
            {posts.map((fm, index) => {
              const { slug, date, title, summary, tags } = fm

              return (
                <Article
                  key={slug}
                  slug={slug}
                  date={date}
                  title={title}
                  summary={summary}
                  tags={tags}
                  border={index !== 0}
                />
              )
            })}
          </section>
        </>
      )}

      {talks.length && (
        <>
          <SectionTitle>
            Talks by <span className="font-serif font-light">{name}</span>
          </SectionTitle>
          <section className="container mx-auto max-w-2xl">
            <ul className="grid grid-cols-1 gap-y-10 lg:gap-y-12">
              {talks.map((talk) => {
                return <Talk key={talk.title} {...talk} authors={[]} />
              })}
            </ul>
          </section>
        </>
      )}
    </>
  )
}
