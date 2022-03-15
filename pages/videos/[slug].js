import PageTitle from '@/components/PageTitle'
import { PageSEO } from '@/components/SEO'

export const getStaticPaths = async () => {
  const { videos } = await fetch('http://localhost:3000/api/youtube').then((res) => res.json())

  return {
    paths: videos.map((vid) => ({ params: { slug: vid.id } })),
    fallback: false,
  }
}

export const getStaticProps = async (context) => {
  const { videos } = await fetch('http://localhost:3000/api/youtube').then((res) => res.json())

  const video = videos.find((vid) =>
    context && context.params ? vid.id === context.params.slug : false
  )

  return {
    props: {
      video,
    },
  }
}

export default function Video({ video }) {
  const descriptionArray = video.description.split('-')

  return (
    <>
      <PageSEO title={`Videos - ${video.title}`} description={video.description} />
      <PageTitle>
        <span dangerouslySetInnerHTML={{ __html: video.title }}></span>
      </PageTitle>
      <div className="aspect-w-16 aspect-h-9 my-10">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {descriptionArray.map((description) => (
        <p key={description} className="text-lg leading-7 text-gray-700">
          {description}
        </p>
      ))}
    </>
  )
}
