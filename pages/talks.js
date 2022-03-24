import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'

export default function Talks() {
  return (
    <>
      <PageSEO title={`Talks - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 p-4 dark:divide-gray-700 xl:p-16">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Talks
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </>
  )
}
