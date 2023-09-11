import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import HubSpotForm from '@/components/HubspotForm'

export async function getStaticProps() {
  return { props: { theme: 'white' } }
}

export default function Devoxx() {
  return (
    <>
      <PageSEO title="Devoxx Quiz - Front-end" description={siteMetadata.description} />

      <div className="container mx-auto pt-20">
        <div className="grid grid-cols-12">
          <div className="col-span-6 col-start-4">
            <HubSpotForm portalId={'513128'} formId={'fb646d14-aed7-4548-a535-5c4b9789aaa6'} />
          </div>
        </div>
      </div>
    </>
  )
}
