import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import HeroSection from '@/components/HeroSection'
import ContentListing from '@/components/ContentListing'
import { getContentWithAuthors } from '@/lib/hooks/useContentData'
import type { ContentItem, AuthorsMap } from '../types'

export async function getStaticProps() {
  return getContentWithAuthors('workshops', 'pink')
}

interface WorkshopsProps {
  workshops: ContentItem[]
  authors: AuthorsMap
}

export default function Workshops({ workshops, authors }: WorkshopsProps) {
  return (
    <>
      <PageSEO
        title={`Workshops - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      <HeroSection
        title="Looking for an inspiring workshop for your people?"
        description="We have great experts that can deliver inspiring workshops at your event. Leave your details and we will reach out to you!"
        imageSrc="/workshops.jpg"
        imageAlt="Workshops"
        showForm={true}
        formConfig={{
          portalId: '513128',
          formId: 'af6d8033-3c2c-4403-8c18-07a3e99f6bcf',
        }}
      />
      <ContentListing items={workshops} authors={authors} contentType="workshop" layout="grid" />
    </>
  )
}
