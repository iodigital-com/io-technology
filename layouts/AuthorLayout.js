import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { PageSEO } from '@/components/SEO'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

export default function AuthorLayout({ children, frontMatter }) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github, website } =
    frontMatter

  const { theme } = useBrandingTheme()
  const textClass = theme === 'default' ? 'text-black' : 'text-white'

  return (
    <>
      <PageSEO title={`Author - ${name}`} description={`About me - ${name}`} />

      <section className={`bg-io_${theme}-500 ${textClass}`}>
        <div className="container mx-auto pt-8 pb-24 md:pb-32">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-4 md:mb-0 xl:col-start-9 xl:row-start-1">
              <Image
                src={avatar}
                width={800}
                height={800}
                layout="responsive"
                className="rounded-full"
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
                        {linkedin.replace('https://www.linkedin.com/in/', '').replace('/', '')}
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
    </>
  )
}
