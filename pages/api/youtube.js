export default async (req, res) => {
  console.log('going to fetch youtube')
  const baseURL = 'https://www.googleapis.com/youtube/v3/'
  const channelId = 'UCNhy3hGzwMfbtX3Ei8Htcpg'

  const { items } = await fetch(
    `${baseURL}search?maxResults=100&part=snippet&order=date&channelId=${channelId}&key=${process.env.YOUTUBE_API_KEY}`
  )
    .then((res) => res.json())
    .catch((err) => console.error(err))

  const videos = items
    .filter(({ snippet, id }) => id.kind === 'youtube#video' && snippet.title !== 'Private video')
    .map(({ id, snippet }) => ({
      ...snippet,
      id: id.videoId,
    }))

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ videos }))
}
