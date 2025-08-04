import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllVideos } from '@/lib/youtube'
import VideoCard from '@/components/VideoCard'
import HeroSection from '@/components/HeroSection'

export async function getStaticProps() {
  const { videos } = await getAllVideos()
  return { props: { videos, theme: 'blue' } }
}

interface VideosProps {
  videos: any[]
}

export default function Videos({ videos }: VideosProps) {
  return (
    <>
      <PageSEO title={`Videos - ${siteMetadata.author}`} description={siteMetadata.description} />

      <HeroSection
        title="Check out our videos from meetups and expert talks"
        description="Most of our meetups are live streamed to YouTube. Please subscribe to get notified when a meetup is planned!"
        imageSrc="/meetup.jpg"
        imageAlt="meetup"
        showForm={false}
      />

      <div className="container mx-auto">
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {videos.map((vid: any) => (
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
