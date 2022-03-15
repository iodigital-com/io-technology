import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import Card from '@/components/Card'
import { getAllVideos } from '@/lib/youtube'

export async function getStaticProps() {
  const { videos } = await getAllVideos()
  return { props: { videos } }
}

export default function Videos({ videos }) {
  return (
    <>
      <PageSEO title={`Videos - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Videos
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {videos.map((vid) => (
              <div key={vid.id} className="md p-4 md:w-1/3">
                <Card
                  title={vid.title}
                  description={vid.description}
                  imgSrc={vid.thumbnails.high.url}
                  unoptimized={true}
                  href={`/videos/${vid.id}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
