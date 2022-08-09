import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import { getAuthors } from '@/lib/authors'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import TalksOverview from '@/components/TalksOverview'
import Image from '@/components/Image'

export async function getStaticProps() {
  const talks = await getAllFilesFrontMatter('talks')
  const authors = await getAuthors(talks)

  return { props: { talks, authors, theme: 'rouge' } }
}

export default function Articles({ talks, authors }) {
  return (
    <>
      <PageSEO title={`Talks - ${siteMetadata.author}`} description={siteMetadata.description} />
      <section className={`bg-black text-white`}>
        <div className="container mx-auto pt-8 pb-24 md:pb-32">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mt-4 md:mb-10 xl:row-start-1 xl:mt-12 xl:mb-16">
              <h1 className="text-4xl md:text-5xl xl:text-7xl">
                Awesome <span className="font-serif">Expert talks</span> to share knowledge
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
            <div className="col-span-full md:col-span-5 md:col-start-4 xl:col-span-4 xl:col-start-4">
              <div className="xl:w-11/12">
                <p className="mb-4 ">
                  We have some great experts that can deliver some expert talks at your location!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TalksOverview talks={talks} authors={authors} />
    </>
  )
}
