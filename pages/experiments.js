import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import Image from 'next/image'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'
import { getAuthors } from '@/lib/authors'
import Experiment from '@/components/Experiment'

export async function getStaticProps() {
  const experimentsFrontmatter = await getAllFilesFrontMatter('experiments')
  const authors = await getAuthors(experimentsFrontmatter)

  const experiments = await Promise.all(
    experimentsFrontmatter.map(async (experiment) => {
      const exp = await getFileBySlug('experiments', experiment.slug)
      return {
        ...experiment,
        authors: experiment.authors.map((author) => authors[author]),
        content: exp.mdxSource,
      }
    })
  )

  return { props: { experiments } }
}

export default function Experiments({ experiments }) {
  const { theme } = useBrandingTheme()
  const textClass = theme === 'default' ? 'text-black' : 'text-white'

  return (
    <>
      <PageSEO
        title={`Experiments - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      <section className={`bg-io_${theme}-500 ${textClass}`}>
        <div className="container mx-auto pt-8 pb-24 md:pb-32">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mt-4 md:mb-10 xl:row-start-1 xl:mt-12 xl:mb-16">
              <h1 className="text-4xl md:text-5xl xl:text-7xl">
                Don't you just love experimenting with{' '}
                <span className="font-serif font-light">code?</span>
              </h1>
            </div>
            <div className="col-start-1 col-end-12 mb-8 md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-4 md:mb-0 xl:col-start-8 xl:row-start-1">
              <Image
                src={'/experiments.jpg'}
                alt="hackathon"
                width={1200}
                height={1200}
                className="rounded-full"
                sizes="100vw"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className="col-span-full md:col-span-5 md:col-start-3 xl:col-span-4 xl:col-start-3">
              <div className="xl:w-11/12">
                <p className="mb-4">
                  We do! Especially during hackathons and innovation days. Here are some of our
                  experiments to play around with. Some of them rely on browser flags to be set.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto">
        <ul>
          {experiments.map((experiment, index) => (
            <li key={experiment.title}>
              <Experiment {...experiment} border={index !== 0} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
