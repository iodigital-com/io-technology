import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'
import { getAuthors } from '@/lib/authors'
import Experiment from '@/components/Experiment'
import HeroSection from '@/components/HeroSection'

export async function getStaticProps() {
  const experimentsFrontmatter = await getAllFilesFrontMatter('experiments')
  const authors = await getAuthors(experimentsFrontmatter)

  const experiments = await Promise.all(
    experimentsFrontmatter.map(async (experiment) => {
      const exp = await getFileBySlug('experiments', experiment.slug || '')
      return {
        ...experiment,
        authors: experiment.authors.map((author) => authors[author]),
        content: exp.mdxSource,
      }
    })
  )

  return { props: { experiments } }
}

interface ExperimentsProps {
  experiments: any[]
}

export default function Experiments({ experiments }: ExperimentsProps) {
  return (
    <>
      <PageSEO
        title={`Experiments - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      <HeroSection
        title="Don't you just love experimenting with code?"
        description="We do! Especially during hackathons and innovation days. Here are some of our experiments to play around with. Some of them rely on browser flags to be set."
        imageSrc="/experiments.jpg"
        imageAlt="hackathon"
        imagePosition="left"
        showForm={false}
      />
      <div className="container mx-auto">
        <ul>
          {experiments.map((experiment: any, index: number) => (
            <li key={experiment.title}>
              <Experiment {...experiment} border={index !== 0} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
