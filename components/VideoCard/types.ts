interface VideoThumbnail {
  url: string
}

export interface Video {
  id: string
  title: string
  description: string
  thumbnails: {
    default: VideoThumbnail
    medium?: VideoThumbnail
    high?: VideoThumbnail
    standard?: VideoThumbnail
    maxres?: VideoThumbnail
  }
}

export interface VideoCardProps {
  video: Video
  playButton?: boolean
}
