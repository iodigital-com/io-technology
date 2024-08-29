const { compareAsc, compareDesc } = require('date-fns')
const { marked } = require('marked')
const { parse } = require('node-html-parser')
const fs = require('fs')
const path = require('path')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

const COW_GROUPS = [
  'coven-of-wisdom',
  'coven-of-wisdom-herentals',
  'coven-of-wisdom-amsterdam',
  'coven-of-wisdom-utrecht',
]

function getGroupWithEventsByUrlName(groupUrlName) {
  const query = `{
    groupByUrlname(urlname: "${groupUrlName}") {
      name
      upcomingEvents(input: { first: 10 }) {
        edges {
          node {
            title
            description
            venue {
              name
              address
              postalCode
              city
              country
            }
            eventUrl
            dateTime
            endTime
            timezone
          }
        }
      }
      pastEvents(input: {}) {
        edges {
          node {
            title
            description
            venue {
              name
              address
              postalCode
              city
              country
            }
            eventUrl
            dateTime
            endTime
            timezone
          }
        }
      }
    }
  }`

  return fetch('https://api.meetup.com/gql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.errors) {
        throw new Error(JSON.stringify(res.errors))
      }

      return res.data
    })
}

function stripHtml(input) {
  const parsed = parse(input)
  const text = parsed.textContent || ''
  const trimmed = text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[\r\n]+/g, ' ')
  return trimmed
}

function parseMarkdown(input) {
  return marked.parse(input)
}

function transformGroupsToEvents(events, eventType) {
  const normalizedEvents = events.map((event) =>
    event.groupByUrlname[eventType].edges.map((edge) => ({
      ...edge.node,
      groupName: event.groupByUrlname.name,
    }))
  )
  const flattenedEvents = normalizedEvents.flat()
  const sanitizedEvents = flattenedEvents.map((event) => ({
    ...event,
    description: stripHtml(parseMarkdown(event.description)),
  }))
  const sortedEvents = sanitizedEvents.sort((a, b) => {
    const operation = eventType === 'upcomingEvents' ? compareAsc : compareDesc
    return operation(new Date(a.dateTime), new Date(b.dateTime))
  })
  return sortedEvents
}
const getEvents = async () => {
  const groups = await Promise.all(COW_GROUPS.map(getGroupWithEventsByUrlName))
  const upcomingEvents = transformGroupsToEvents(groups, 'upcomingEvents')
  const pastEvents = transformGroupsToEvents(groups, 'pastEvents')

  fs.writeFileSync(
    path.resolve('data/events.json'),
    JSON.stringify({ events: [...upcomingEvents, ...pastEvents] })
  )
}

getEvents()
