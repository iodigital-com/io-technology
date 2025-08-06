import youtube from '@/data/youtube.json'

export async function getAllVideos() {
  return youtube
}

export async function getLatestVideos(num = 5) {
  const { videos } = await getAllVideos()
  // Ensure videos is an array before sorting
  const videosArray = Array.isArray(videos) ? videos : []
  return {
    videos: videosArray
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, num),
  }
}
