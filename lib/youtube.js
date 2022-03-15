export async function getAllVideos() {
  return fetch('http://localhost:3000/api/youtube').then((res) => res.json())
}

export async function getLatestVideos(num = 5) {
  const { videos } = await getAllVideos()
  return {
    videos: videos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, num),
  }
}
