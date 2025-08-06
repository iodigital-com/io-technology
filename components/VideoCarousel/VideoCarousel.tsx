import VideoCard from '@/components/VideoCard'

interface VideoThumbnail {
  url: string
}

interface Video {
  id: string
  title: string
  description: string
  thumbnails: {
    default: VideoThumbnail
  }
}

interface VideoCarouselProps {
  videos?: Video[]
}

const VideoCarousel = ({ videos = [] }: VideoCarouselProps) => {
  // Ensure videos is an array
  const videosArray = Array.isArray(videos) ? videos : []

  return (
    <div className="my-12 mb-24 flex flex-col flex-wrap items-center md:snap-x md:flex-row md:flex-nowrap md:gap-12 md:overflow-x-auto md:px-12">
      {videosArray.map((vid: Video) => (
        <div
          key={vid.id}
          className="mb-8 shrink-0 md:mb-0 md:snap-center"
          style={{ width: 500, maxWidth: '100vw' }}
        >
          <VideoCard video={vid} />
        </div>
      ))}
    </div>
  )
}

export default VideoCarousel
