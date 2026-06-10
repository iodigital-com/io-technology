import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'
import { getAuthors } from '@/lib/authors'
import Experiment from '@/components/Experiment'
import type { ExperimentProps } from '@/components/Experiment/types'
import HeroSection from '@/components/HeroSection'

export async function getStaticProps() {
  const experimentsFrontmatter = await getAllFilesFrontMatter('experiments')
  const authors = await getAuthors(experimentsFrontmatter)

  const experiments = await Promise.all(
    experimentsFrontmatter.map(async (experiment) => {
      const exp = await getFileBySlug('experiments', experiment.slug || '')
      return {
        ...experiment,
        authors: experiment.authors.map((author) => authors[author]).filter(Boolean),
        content: exp.mdxSource,
      }
    })
  )

  return { props: { experiments, transparentHeader: true } }
}

interface ExperimentsProps {
  experiments: ExperimentProps[]
  transparentHeader: boolean
}

export default function Experiments({ experiments, transparentHeader }: ExperimentsProps) {
  return (
    <>
      <PageSEO
        title={`Experiments - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      <HeroSection
        title="Don't you just love experimenting with code?"
        description="We do! Especially during hackathons and innovation days. Here are some of our experiments to play around with. Some of them rely on browser flags to be set."
        isDarkBackground={transparentHeader}
      />
      <div className="container mx-auto">
        <ul>
          {experiments.map((experiment, index: number) => (
            <li key={experiment.title}>
              <Experiment {...experiment} border={index !== 0} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
