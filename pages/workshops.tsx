import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import HeroSection from '@/components/HeroSection'
import HubspotForm from '@/components/HubspotForm'
import ContentListing from '@/components/ContentListing'
import { getContentWithAuthors } from '@/lib/hooks/useContentData'
import type { ContentItem, AuthorsMap } from '../types'

export async function getStaticProps() {
  return getContentWithAuthors('workshops', 'pink', null, true)
}

interface WorkshopsProps {
  workshops: ContentItem[]
  authors: AuthorsMap
  transparentHeader: boolean
}

export default function Workshops({ workshops, authors, transparentHeader }: WorkshopsProps) {
  return (
    <>
      <PageSEO
        title={`Workshops - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      <HeroSection
        title="Looking for an inspiring workshop for your people?"
        description="We have great experts that can deliver inspiring workshops at your event. Leave your details and we will reach out to you!"
        isDarkBackground={transparentHeader}
      >
        <div className="col-span-full md:col-span-5 xl:col-span-6 mt-6 lg:mt-12">
          <HubspotForm
            portalId="513128"
            formId="af6d8033-3c2c-4403-8c18-07a3e99f6bcf"
            isDarkBackground={transparentHeader}
          />
        </div>
      </HeroSection>
      <ContentListing items={workshops} authors={authors} contentType="workshop" layout="grid" />
    </>
  )
}
