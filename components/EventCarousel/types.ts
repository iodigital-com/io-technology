import type { Event } from '../../types'

// ===========================
// EVENT CAROUSEL TYPES
// ===========================

// Display options for the carousel
export interface CarouselDisplayOptions {
  showPastEvents?: boolean
  maxEvents?: number
  autoScroll?: boolean
  scrollSpeed?: number
  showEventType?: boolean
  showEventLocation?: boolean
  compactMode?: boolean
}

// Event carousel props
export interface EventCarouselProps {
  events: Event[]
  displayOptions?: CarouselDisplayOptions
  onEventClick?: (event: Event) => void
  onEventHover?: (event: Event) => void
  className?: string
  loading?: boolean
  error?: string
}

// Event card props for individual events
export interface EventCardProps {
  event: Event
  compact?: boolean
  showType?: boolean
  showLocation?: boolean
  onClick?: (event: Event) => void
  onHover?: (event: Event) => void
}
