import { getAllFilesFrontMatter } from '@/lib/mdx'
import { PageSEO } from '@/components/SEO'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import siteMetadata from '@/data/siteMetadata'
import MarkdownRenderer from 'react-markdown-renderer'
import { getAuthors } from '@/lib/authors'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import SocialIcon from '@/components/social-icons'
import Link from '@/components/Link'

export const getStaticPaths = async () => {
  const workshops = await getAllFilesFrontMatter('workshops')

  return {
    paths: workshops.map((workshop) => ({ params: { slug: workshop.slug } })),
    fallback: false,
  }
}

export const getStaticProps = async (context) => {
  const workshops = await getAllFilesFrontMatter('workshops')

  const workshopDetails = workshops.find((workshop) =>
    context?.params ? workshop.slug === context.params.slug : false
  )

  const authors = await getAuthors(workshops)
  const workshopAuthors = workshopDetails.authors.map((author) => authors[author])
  return {
    props: {
      workshop: workshopDetails,
      authors: workshopAuthors,
      theme: 'default',
    },
  }
}

export default function Workshop({ workshop, authors }) {
  const { theme } = useBrandingTheme()
  const author = authors?.[0]

  return (
    <>
      <PageSEO title={`${workshop.title} - ${author.name}`} description={workshop.summary} />

      <section className={`bg-io_${theme}-500`}>
        <div className="container mx-auto pt-8 pb-12">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 flex flex-col text-center md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-4 md:mb-0 xl:col-start-9 xl:row-start-1">
              <Image
                src={author.avatar}
                width={800}
                height={800}
                layout="responsive"
                className="rounded-full"
                alt={`avatar ${author.name}`}
              />
              <div className="mt-3">
                <Link
                  href={`/authors/${author.slug[0]}`}
                  className={`text-io_${theme}-600 hover:text-io_${theme}-700 text-xl`}
                >
                  {author.name}
                </Link>
                <p>{author.occupation}</p>
              </div>
            </div>

            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mt-4 md:mb-10 xl:row-start-1 xl:mt-12 xl:mb-16">
              <h1 className="mb-2 text-4xl md:text-5xl xl:text-7xl">
                <MarkdownRenderer markdown={workshop.title} />
              </h1>
              <p className="mb-4 text-lg">{workshop.summary}</p>

              <div className="mb-3 flex flex-wrap gap-3">
                {workshop.tags.length > 0 &&
                  workshop.tags.map((tag) => (
                    <div key={tag} className="inline-block whitespace-nowrap">
                      <Tag key={tag} text={tag} />
                    </div>
                  ))}
              </div>

              <div className="flex flex-wrap gap-4">
                {workshop.slides && (
                  <>
                    <dt className="sr-only">Slides</dt>
                    <dd>
                      <SocialIcon
                        kind="slide-deck"
                        href={workshop.slides}
                        size="8"
                        title="Slides"
                      />
                    </dd>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
