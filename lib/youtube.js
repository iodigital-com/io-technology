import youtube from '@/data/youtube.json'

export async function getAllVideos() {
  return youtube
}

export async function getLatestVideos(num = 5) {
  const { videos } = await getAllVideos()
  return {
    videos: videos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, num),
  }
}
