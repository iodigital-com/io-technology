import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'

import HeroSection from '@/components/HeroSection'
import HubspotForm from '@/components/HubspotForm'
import ContentListing from '@/components/ContentListing'
import { getContentWithAuthors } from '@/lib/hooks/useContentData'
import type { ContentItem, AuthorsMap } from '../types'

export async function getStaticProps() {
  return getContentWithAuthors('talks', 'pink', null, true)
}

interface TalksProps {
  talks: ContentItem[]
  authors: AuthorsMap
  transparentHeader: boolean
}

export default function Talks({ talks, authors, transparentHeader }: TalksProps) {
  return (
    <>
      <PageSEO title={`Talks - ${siteMetadata.author}`} description={siteMetadata.description} />
      <HeroSection
        title="Looking for an inspiring talk at your event?"
        description="We have great experts that can deliver inspiring talks at your event. Leave your details and we will reach out to you!"
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
      <ContentListing items={talks} authors={authors} contentType="talk" layout="grid" />
    </>
  )
}
