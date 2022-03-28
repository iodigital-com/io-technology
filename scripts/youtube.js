const fs = require('fs')
const path = require('path')

require('dotenv').config()
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

const getVideos = async () => {
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

  fs.writeFileSync(path.resolve('data/youtube.json'), JSON.stringify({ videos }))
}

getVideos()
