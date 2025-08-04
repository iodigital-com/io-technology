import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'

import HeroSection from '@/components/HeroSection'
import ContentListing from '@/components/ContentListing'
import { getContentWithAuthors } from '@/lib/hooks/useContentData'
import type { ContentItem, AuthorsMap } from '../types'

export async function getStaticProps() {
  return getContentWithAuthors('talks', 'pink')
}

interface TalksProps {
  talks: ContentItem[]
  authors: AuthorsMap
}

export default function Talks({ talks, authors }: TalksProps) {
  return (
    <>
      <PageSEO title={`Talks - ${siteMetadata.author}`} description={siteMetadata.description} />
      <HeroSection
        title="Looking for an inspiring talk at your event?"
        description="We have great experts that can deliver inspiring talks at your event. Leave your details and we will reach out to you!"
        imageSrc="/talks.jpg"
        imageAlt="Talks"
        showForm={true}
        formConfig={{
          portalId: '513128',
          formId: 'af6d8033-3c2c-4403-8c18-07a3e99f6bcf',
        }}
      />
      <ContentListing items={talks} authors={authors} contentType="talk" layout="grid" />
    </>
  )
}
