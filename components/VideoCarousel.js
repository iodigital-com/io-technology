import VideoCard from '@/components/VideoCard'

const VideoCarousel = ({ videos }) => {
  return (
    <div className="my-12 mb-24 flex flex-col flex-wrap items-center md:snap-x md:flex-row md:flex-nowrap md:gap-12 md:overflow-x-auto md:px-12">
      {videos.map((vid) => (
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
