import events from '@/data/events.json'

export async function getAllEvents() {
  return events
}

export async function getLatestEvents(num = 5) {
  const { events } = await getAllEvents()
  // Ensure events is an array before sorting
  const eventsArray = Array.isArray(events) ? events : []

  return {
    events: eventsArray.slice(0, num).sort((a, b) => {
      return new Date(b.dateTime) - new Date(a.dateTime)
    }),
  }
}

export const isFutureEvent = (date) => {
  return new Date(date) > new Date()
}

export const hasFutureEvents = (events) => {
  // Ensure events is an array before processing
  const eventsArray = Array.isArray(events) ? events : []
  return eventsArray.some((event) => isFutureEvent(event.dateTime))
}
