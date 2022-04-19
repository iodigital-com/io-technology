import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import Image from '@/components/Image'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import { Player, Controls } from '@lottiefiles/react-lottie-player'

export default function Podcast() {
  const { theme } = useBrandingTheme()
  const textClass = theme === 'default' ? 'text-black' : 'text-white'

  return (
    <>
      <PageSEO title={`Podcast - ${siteMetadata.author}`} description={siteMetadata.description} />
      <section className={`bg-io_${theme}-500 ${textClass}`}>
        <div className="container mx-auto pt-8 pb-24 md:pb-32 xl:pb-40">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mt-4 md:mb-10 xl:row-start-1 xl:mt-12 xl:mb-16">
              <h1 className="text-4xl md:text-5xl xl:text-7xl">
                Soon we'll release our <span className="font-serif">podcast</span>
              </h1>
            </div>
            <div className="col-start-1 col-end-12 mb-8 md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-4 md:mb-0 xl:col-start-8 xl:row-start-1">
              <Image
                src={'/podcast.jpg'}
                width={816}
                height={816}
                layout="responsive"
                className="rounded-full"
              />
            </div>
            <div className="col-span-full md:col-span-5 md:col-start-3 xl:col-span-4 xl:col-start-3">
              <div className="xl:w-11/12">
                <p className="mb-4">
                  We're busy recording a brand new podcast with iO college's talking about
                  development & technology
                </p>
                <Player autoplay loop src="/podcast.json" speed={0.5} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
