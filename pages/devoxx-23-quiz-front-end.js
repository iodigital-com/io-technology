import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import HubSpotForm from '@/components/HubspotForm'

import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import Image from '@/components/Image'

export async function getStaticProps() {
  return { props: { theme: 'beige' } }
}

export default function DevoxxFrontend() {
  const { theme } = useBrandingTheme()

  return (
    <>
      <PageSEO title="Devoxx Quiz - Front-end" description={siteMetadata.description} />

      <section className={`bg-io_${theme}-500`}>
        <div className="container mx-auto pt-8 pb-24 md:pb-32">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mt-4 md:mb-10 xl:row-start-1 xl:mt-12 xl:mb-16">
              <h1 className="text-4xl md:text-5xl xl:text-5xl">
                The iO <span className="font-serif font-light">Front-end developer</span> quiz
              </h1>
            </div>
            <div className="col-start-1 col-end-12 mb-8 md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-4 md:mb-0 xl:col-start-9 xl:row-start-1">
              <Image
                src={'/talks.jpg'}
                width={1192}
                height={1192}
                layout="responsive"
                className="rounded-full"
                alt=""
              />
            </div>
            <div className="col-span-full md:col-span-5 md:col-start-4 xl:col-span-6">
              <div className="xl:w-11/12">
                <p className="mb-4 ">
                  Are you a Front-end developer? Are you a good Front-end developer? Or a great
                  Front-end developer? Go on, show off you skills and win fabulous prizes!
                </p>
                <p className="mb-4 ">
                  There are no tricks, only one correct answer per question. All the given code
                  compiles and unless specified explicitly, you may assume we are using a version of
                  Front-end that supports the code you are seeing. And it’s a quiz, so “I don’t
                  know” is always the wrong answer. 😉
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto pt-20">
        <div className="grid grid-cols-12">
          <div className="col-span-12 xl:col-span-8 xl:col-start-3">
            <HubSpotForm
              className="quiz"
              portalId={'513128'}
              formId={'fb646d14-aed7-4548-a535-5c4b9789aaa6'}
            />
          </div>
        </div>
      </div>
    </>
  )
}
