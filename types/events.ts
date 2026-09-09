// ===========================
// EVENT TYPES
// ===========================

export enum EventType {
  MEETUP = 'meetup',
  CONFERENCE = 'conference',
  WORKSHOP = 'workshop',
  WEBINAR = 'webinar',
}

export interface EventLocation {
  name: string
  address: string
  postalCode: string
  city: string
  country: string
}

export interface Event {
  title: string
  description: string
  venue?: EventLocation | null
  eventUrl: string
  dateTime: string
  endTime?: string
  timezone: string
  groupName: string
  type?: EventType
  speakers?: string[]
  tags?: string[]
}
