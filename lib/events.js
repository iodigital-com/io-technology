import events from '@/data/events.json'

export async function getAllEvents() {
  return events
}

export async function getLatestEvents(num = 5) {
  const { events } = await getAllEvents()

  return {
    events: events.slice(0, num),
  }
}

export const isFutureEvent = (date) => {
  return new Date(date) > new Date()
}

export const hasFutureEvents = (events) => {
  return events.some((event) => isFutureEvent(event.dateTime))
}
