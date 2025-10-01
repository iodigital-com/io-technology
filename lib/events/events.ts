import events from '@/data/events.json'
import type { Event } from '../../types/events'

export async function getAllEvents(): Promise<typeof events> {
  return events
}

export async function getLatestEvents(num: number = 5): Promise<{ events: Event[] }> {
  const { events }: { events: Event[] } = await getAllEvents()
  // Ensure events is an array before sorting
  const eventsArray = Array.isArray(events) ? events : []

  return {
    events: eventsArray.slice(0, num).sort((a, b) => {
      return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    }),
  }
}

export const isFutureEvent = (date: string): boolean => {
  return new Date(date) > new Date()
}

export const hasFutureEvents = (events: Event[]): boolean => {
  // Ensure events is an array before processing
  const eventsArray = Array.isArray(events) ? events : []
  return eventsArray.some((event) => isFutureEvent(event.dateTime))
}
