// ===========================
// VIDEO TYPES
// ===========================

// Enhanced video interface
export interface Video {
  id: string
  title: string
  description?: string
  url: string
  thumbnail?: string
  duration?: string
  publishedAt?: string
  viewCount?: number
  likeCount?: number
  channelName?: string
  channelUrl?: string
  tags?: string[]
  category?: string
}

// Video player options
export interface VideoPlayerOptions {
  autoplay?: boolean
  controls?: boolean
  muted?: boolean
  loop?: boolean
  playbackRate?: number
  quality?: 'auto' | '144p' | '240p' | '360p' | '480p' | '720p' | '1080p'
}

// Video carousel display options
export interface VideoCarouselDisplayOptions {
  showDescription?: boolean
  showDuration?: boolean
  showViewCount?: boolean
  showChannelName?: boolean
  showTags?: boolean
  maxVideos?: number
  autoScroll?: boolean
  thumbnailSize?: 'sm' | 'md' | 'lg'
}

// Enhanced VideoCarousel props
export interface VideoCarouselProps {
  videos: Video[]
  displayOptions?: VideoCarouselDisplayOptions
  playerOptions?: VideoPlayerOptions
  onVideoClick?: (video: Video) => void
  onVideoPlay?: (video: Video) => void
  loading?: boolean
  error?: string
  className?: string
  emptyStateMessage?: string
}

// Individual video card props
export interface VideoCardProps {
  video: Video
  showDescription?: boolean
  showDuration?: boolean
  showViewCount?: boolean
  showChannelName?: boolean
  showTags?: boolean
  thumbnailSize?: 'sm' | 'md' | 'lg'
  onClick?: (video: Video) => void
  onPlay?: (video: Video) => void
}
