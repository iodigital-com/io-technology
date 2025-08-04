import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import HeroSection from '@/components/HeroSection'
import ContentListing from '@/components/ContentListing'
import { getSortedContent } from '@/lib/hooks/useContentData'

export async function getStaticProps() {
  return getSortedContent('talks', 'pink')
}

export default function Talks({ talks, authors }) {
  return (
    <>
      <PageSEO title={`Talks - ${siteMetadata.author}`} description={siteMetadata.description} />
      <HeroSection
        title={
          <>
            Looking for an <span className="font-serif font-light">inspiring talk</span> at your
            event?
          </>
        }
        description={
          <>
            We have great experts that can deliver inspiring talks at your event.
            <br />
            Leave your details and we will reach out to you!
          </>
        }
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
