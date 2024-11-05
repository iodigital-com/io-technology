import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import HubSpotForm from '@/components/HubspotForm'

import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import Image from '@/components/Image'

export async function getStaticProps() {
  return { props: { theme: 'beige' } }
}

export default function JfallKotlin() {
  const { theme } = useBrandingTheme()

  return (
    <>
      <PageSEO title="J-Fall Quiz - Kotlin" description={siteMetadata.description} />

      <section className={`bg-io_${theme}-500`}>
        <div className="container mx-auto pb-24 pt-8 md:pb-32">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mb-10 md:mt-4 xl:row-start-1 xl:mb-16 xl:mt-12">
              <h1 className="text-4xl md:text-5xl xl:text-6xl">
                The iO <span className="font-serif font-light">Kotlin developer</span> quiz
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
                  Are you a Kotlin developer? Are you a good Kotlin developer? Or a great Kotlin
                  developer? Go on, show off you skills and win fabulous prizes!
                </p>
                <p className="mb-4 ">
                  There are no tricks, only one correct answer per question. All the given code
                  compiles. And it’s a quiz, so “I don’t know” is always the wrong answer. 😉
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
              formId={'39536cb0-8368-4651-bf2b-422978930577'}
            />
          </div>
        </div>
      </div>
    </>
  )
}
