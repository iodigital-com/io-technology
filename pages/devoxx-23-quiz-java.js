import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import HubSpotForm from '@/components/HubspotForm'

export async function getStaticProps() {
  return { props: { theme: 'white' } }
}

export default function Devoxx() {
  return (
    <>
      <PageSEO title="Devoxx Quiz - Java" description={siteMetadata.description} />

      <div className="container mx-auto pt-20">
        <div className="grid grid-cols-12">
          <div className="col-span-6 col-start-4">
            <HubSpotForm portalId={'513128'} formId={'b8284e1d-5b29-41c9-9135-c5f9b29f18e2'} />
          </div>
        </div>
      </div>
    </>
  )
}
