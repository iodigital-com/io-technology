import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import { getAuthors } from '@/lib/authors'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import Talk from '@/components/Talk'
import Image from '@/components/Image'
import sortCreation from '@/lib/utils/sortCreation'
import HubspotForm from '@/components/HubspotForm'

export async function getStaticProps() {
  const talks = await getAllFilesFrontMatter('talks')
  const talksSorted = talks.sort(sortCreation)
  const authors = await getAuthors(talks)

  return { props: { talks: talksSorted, authors, theme: 'pink' } }
}

export default function Talks({ talks, authors }) {
  const { theme } = useBrandingTheme()

  return (
    <>
      <PageSEO title={`Talks - ${siteMetadata.author}`} description={siteMetadata.description} />
      <section className={`bg-io_${theme}-500`}>
        <div className="container mx-auto pt-8 pb-24 md:pb-32">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mt-4 md:mb-10 xl:row-start-1 xl:mt-12 xl:mb-16">
              <h1 className="text-4xl md:text-5xl xl:text-7xl">
                Looking for an <span className="font-serif font-light">inspiring talk</span> at your
                event?
              </h1>
            </div>
            <div className="col-start-1 col-end-12 mb-8 md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-4 md:mb-0 xl:col-start-9 xl:row-start-1">
              <Image
                src={'/talks.jpg'}
                width={1192}
                height={1192}
                layout="responsive"
                className="rounded-full"
                alt=""
              />
            </div>
            <div className="col-span-full md:col-span-5 md:col-start-4 xl:col-span-6">
              <div className="xl:w-11/12">
                <p className="mb-4 ">
                  We have great experts that can deliver inspiring talks at your event.
                  <br />
                  Leave your details and we will reach out to you!
                </p>
                <HubspotForm portalId={'513128'} formId="af6d8033-3c2c-4403-8c18-07a3e99f6bcf" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto py-10 lg:py-16">
        <ul className="grid gap-y-10 md:gap-x-4 lg:grid-cols-2 lg:gap-y-12 xl:grid-cols-3 xl:gap-x-6">
          {talks.map((talk) => {
            const talkAuthors = talk.authors.map((author) => authors[author])
            return <Talk key={talk.title} {...talk} authors={talkAuthors} />
          })}
        </ul>
      </div>
    </>
  )
}
