import { PageSEO } from '@/components/SEO'
import { getAllVideos } from '@/lib/youtube'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import formatDate from '@/lib/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

export const getStaticPaths = async () => {
  const { videos } = await getAllVideos()

  return {
    paths: videos.map((vid) => ({ params: { slug: vid.id } })),
    fallback: false,
  }
}

export const getStaticProps = async (context) => {
  const { videos } = await getAllVideos()

  const video = videos.find((vid) =>
    context && context.params ? vid.id === context.params.slug : false
  )

  return {
    props: {
      video,
      theme: 'green',
    },
  }
}

export default function Video({ video }) {
  const descriptionArray = video.description.split('-')
  const { theme } = useBrandingTheme()

  return (
    <>
      <PageSEO title={`${video.title} - ${siteMetadata.author}`} description={video.description} />

      <div className={`bg-io_${theme}-500 mb-72 pb-14 pt-24`}>
        <div className="container mx-auto">
          <h1 className="text-4xl font-medium xl:text-7xl">
            <span dangerouslySetInnerHTML={{ __html: video.title }}></span>
          </h1>
          <div className="mb-4">
            <p className="inline text-xl font-light">
              Published on&nbsp;
              <time className="inline font-light" dateTime={video.publishedAt}>
                {formatDate(video.publishedAt)}
              </time>
            </p>
          </div>
          <div className="grid grid-cols-4">
            <div className="col-span-full col-start-1 text-2xl md:col-start-2 xl:col-start-3">
              {descriptionArray.map((description) => (
                <p key={description}>{description}</p>
              ))}
            </div>
          </div>

          <div className="-mt-20 translate-y-32 md:-mt-64 md:translate-y-72">
            <div className="aspect-w-16 aspect-h-9 my-10">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
