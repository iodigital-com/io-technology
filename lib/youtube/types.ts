// ===========================
// YOUTUBE INTEGRATION TYPES
// ===========================

// Video quality options
export type VideoQuality = 'default' | 'medium' | 'high' | 'standard' | 'maxres'

// Video duration format
export interface VideoDuration {
  hours?: number
  minutes: number
  seconds: number
  totalSeconds: number
  formatted: string // e.g., "10:30", "1:23:45"
}

// Enhanced YouTube video interface
export interface YouTubeVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  channelId: string
  channelTitle: string
  categoryId?: string
  defaultLanguage?: string
  duration?: VideoDuration
  thumbnails: {
    default?: YouTubeThumbnail
    medium?: YouTubeThumbnail
    high?: YouTubeThumbnail
    standard?: YouTubeThumbnail
    maxres?: YouTubeThumbnail
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
    dislikeCount?: string
    favoriteCount?: string
    commentCount?: string
  }
  tags?: string[]
  url: string
  embedUrl?: string
  liveDetails?: {
    actualStartTime?: string
    actualEndTime?: string
    scheduledStartTime?: string
    concurrentViewers?: string
  }
}

// Thumbnail information
export interface YouTubeThumbnail {
  url: string
  width: number
  height: number
}

// Channel information
export interface YouTubeChannel {
  id: string
  title: string
  description?: string
  customUrl?: string
  publishedAt: string
  thumbnails: {
    default?: YouTubeThumbnail
    medium?: YouTubeThumbnail
    high?: YouTubeThumbnail
  }
  statistics?: {
    viewCount?: string
    subscriberCount?: string
    hiddenSubscriberCount?: boolean
    videoCount?: string
  }
  brandingSettings?: {
    channel?: {
      title?: string
      description?: string
      keywords?: string
      trackingAnalyticsAccountId?: string
      moderateComments?: boolean
      showRelatedChannels?: boolean
      showBrowseView?: boolean
      featuredChannelsTitle?: string
      featuredChannelsUrls?: string[]
    }
  }
}

// API request options
export interface YouTubeAPIOptions {
  apiKey: string
  maxResults?: number
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount'
  publishedAfter?: string
  publishedBefore?: string
  regionCode?: string
  relevanceLanguage?: string
  safeSearch?: 'moderate' | 'none' | 'strict'
  type?: 'channel' | 'playlist' | 'video'
  videoCategoryId?: string
  videoDuration?: 'any' | 'long' | 'medium' | 'short'
  videoLicense?: 'any' | 'creativeCommon' | 'youtube'
}

// API response wrapper
export interface YouTubeAPIResponse<T> {
  kind: string
  etag: string
  nextPageToken?: string
  prevPageToken?: string
  regionCode?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: T[]
}

// Search result item
export interface YouTubeSearchResult {
  kind: string
  etag: string
  id: {
    kind: string
    videoId?: string
    channelId?: string
    playlistId?: string
  }
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default?: YouTubeThumbnail
      medium?: YouTubeThumbnail
      high?: YouTubeThumbnail
    }
    channelTitle: string
    liveBroadcastContent?: 'live' | 'none' | 'upcoming'
  }
}

// Enhanced YouTube channel data for our app
export interface YouTubeChannelData {
  channel: YouTubeChannel
  videos: YouTubeVideo[]
  totalResults: number
  hasMore: boolean
  nextPageToken?: string
  lastUpdated: Date
}

// Video filtering and processing options
export interface VideoProcessingOptions {
  filterDuplicates?: boolean
  sortBy?: 'publishedAt' | 'viewCount' | 'title' | 'duration'
  sortOrder?: 'asc' | 'desc'
  includeShorts?: boolean
  includeLiveStreams?: boolean
  minDuration?: number // in seconds
  maxDuration?: number // in seconds
  requiredTags?: string[]
  excludedTags?: string[]
}

// Error types for YouTube API
export interface YouTubeAPIError {
  code: number
  message: string
  errors?: Array<{
    domain: string
    reason: string
    message: string
    locationType?: string
    location?: string
  }>
}
