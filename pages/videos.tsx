import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllVideos } from '@/lib/youtube'
import VideoCard from '@/components/VideoCard'
import type { Video } from '@/components/VideoCard/types'
import HeroSection from '@/components/HeroSection'

export async function getStaticProps() {
  const { videos } = await getAllVideos()
  return { props: { videos, theme: 'green', transparentHeader: true } }
}

interface VideosProps {
  videos: Video[]
  transparentHeader: boolean
}

export default function Videos({ videos, transparentHeader }: VideosProps) {
  return (
    <>
      <PageSEO title={`Videos - ${siteMetadata.author}`} description={siteMetadata.description} />

      <HeroSection
        title="Check out our videos from meetups and expert talks"
        description="Most of our meetups are live streamed to YouTube. Please subscribe to get notified when a meetup is planned!"
        isDarkBackground={transparentHeader}
      />

      <div className="container mx-auto">
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {videos.map((vid) => (
              <div key={vid.id} className="md p-4 md:w-1/3">
                <VideoCard video={vid} playButton={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
