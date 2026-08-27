import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { PageSEO } from '@/components/SEO'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import ContentCard from '@/components/ContentCard'
import SectionTitle from '@/components/SectionTitle'
import type { LayoutProps, Author, FrontMatter } from '../types'

interface AuthorLayoutProps extends LayoutProps {
  frontMatter: Author
  posts: FrontMatter[]
  talks: FrontMatter[]
  workshops: FrontMatter[]
}

export default function AuthorLayout({
  children,
  frontMatter,
  posts,
  talks,
  workshops,
}: AuthorLayoutProps) {
  const { name, avatar, occupation, social } = frontMatter
  const { twitter, linkedin, github, website } = social || {}

  const { theme } = useBrandingTheme()

  return (
    <>
      <PageSEO title={`Author - ${name}`} description={`About me - ${name}`} />

      <section className={`bg-io_${theme}-500`}>
        <div className="container mx-auto pb-12 pt-8">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-4 md:mb-0 xl:col-start-9 xl:row-start-1">
              <Image
                src={avatar}
                width={800}
                height={800}
                className="h-auto w-full rounded-full"
                alt="avatar"
              />
            </div>

            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mb-10 md:mt-4 xl:row-start-1 xl:mb-16 xl:mt-12">
              <h1 className="mb-2 text-4xl md:text-5xl xl:text-7xl">{name}</h1>
              <p className="mb-4 text-2xl">{occupation}</p>
              <div className="flex flex-wrap gap-4">
                {linkedin && (
                  <>
                    <dt className="sr-only">LinkedIn</dt>
                    <dd>
                      <SocialIcon kind="linkedin" href={linkedin} size={5}>
                        {name}
                      </SocialIcon>
                    </dd>
                  </>
                )}
                {twitter && (
                  <>
                    <dt className="sr-only">X</dt>
                    <dd>
                      <SocialIcon kind="x" href={twitter} size={5}>
                        {twitter
                          .replace('https://x.com/', '@')
                          .replace('https://twitter.com/', '@')}
                      </SocialIcon>
                    </dd>
                  </>
                )}
                {github && (
                  <>
                    <dt className="sr-only">Github</dt>
                    <dd>
                      <SocialIcon kind="github" href={github} size={5}>
                        {github.replace('https://github.com/', '')}
                      </SocialIcon>
                    </dd>
                  </>
                )}
                {website && (
                  <>
                    <dt className="sr-only">Website</dt>
                    <dd>
                      <SocialIcon kind="website" href={website} size={5}>
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

      {posts.length ? (
        <>
          <SectionTitle id="articles">
            Articles by <span className="font-serif font-light">{name}</span>
          </SectionTitle>
          <section className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((fm, index) => {
                const { slug, date, title, summary, tags, images } = fm

                return (
                  <ContentCard
                    key={slug || index.toString()}
                    slug={slug || ''}
                    date={date || ''}
                    title={title}
                    summary={summary}
                    tags={tags}
                    authors={[]}
                    border={index !== 0}
                    type="article"
                    showAuthors={false}
                    images={images || []}
                  />
                )
              })}
            </div>
          </section>
        </>
      ) : null}

      {talks.length ? (
        <>
          <SectionTitle id="talks">
            Talks by <span className="font-serif font-light">{name}</span>
          </SectionTitle>
          <section className="container mx-auto max-w-2xl">
            <ul className="grid grid-cols-1 gap-y-10 lg:gap-y-12">
              {talks.map((talk) => {
                return (
                  <ContentCard
                    key={talk.title}
                    slug={talk.slug || ''}
                    date={talk.date || ''}
                    title={talk.title}
                    summary={talk.summary}
                    tags={talk.tags || []}
                    authors={[]}
                    type="talk"
                    layout="list"
                    showAuthors={false}
                    showReadMore={true}
                  />
                )
              })}
            </ul>
          </section>
        </>
      ) : null}

      {workshops.length ? (
        <>
          <SectionTitle id="workshops">
            Workshops by <span className="font-serif font-light">{name}</span>
          </SectionTitle>
          <section className="container mx-auto max-w-2xl">
            <ul className="grid grid-cols-1 gap-y-10 lg:gap-y-12">
              {workshops.map((workshop) => {
                return (
                  <ContentCard
                    key={workshop.title}
                    slug={workshop.slug || ''}
                    date={workshop.date || ''}
                    title={workshop.title}
                    summary={workshop.summary}
                    tags={workshop.tags || []}
                    authors={[]}
                    type="workshop"
                    layout="list"
                    showAuthors={false}
                    showReadMore={true}
                  />
                )
              })}
            </ul>
          </section>
        </>
      ) : null}
    </>
  )
}
