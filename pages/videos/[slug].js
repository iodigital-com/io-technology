import PageTitle from '@/components/PageTitle'

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
  return (
    <>
      <PageTitle>
        <span dangerouslySetInnerHTML={{ __html: video.title }}></span>
      </PageTitle>
      <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{video.description}</p>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </>
  )
}
