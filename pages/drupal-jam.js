import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import HubSpotForm from '@/components/HubspotForm'

import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

export async function getStaticProps() {
  return { props: { theme: 'default' } }
}

export default function DrupalJam() {
  return (
    <>
      <PageSEO title="The iO Pool Request" description={siteMetadata.description} />

      <div className="container mx-auto pt-20">
        <div className="grid grid-cols-12">
          <div className="col-span-12 xl:col-span-8 xl:col-start-3">
            <h1 className="mb-8 text-4xl md:text-5xl xl:text-5xl">
              The iO <span className="font-serif font-light">Pool Request</span>
            </h1>
            <HubSpotForm
              className="quiz"
              portalId={'513128'}
              formId={'e3de18a4-ae3b-4f2c-b76c-b29898f06ff8'}
              style={{ paddingTop: '40px', paddingBottom: '20px', background: '#f4be80' }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
