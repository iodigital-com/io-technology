import Link from '@/components/Link'
import { isFutureEvent } from '@/lib/events'

const EventCarousel = ({ events }) => {
  return (
    <ul className="my-12 mb-24 flex flex-col flex-wrap items-center md:snap-x md:flex-row md:flex-nowrap md:items-stretch md:gap-12 md:overflow-x-auto md:px-12">
      {events.map((event) => (
        <li
          key={event.id}
          className={`mb-8 shrink-0 md:mb-0 md:snap-center ${
            isFutureEvent(event.dateTime) ? '' : ' opacity-50'
          }`}
          style={{ width: 500, maxWidth: '100vw' }}
        >
          <div className="relative flex h-full flex-col  bg-gray-100 p-8">
            <header>
              <h3 className="mb-2 line-clamp-2 text-3xl font-medium">{event.title}</h3>

              <p className="line-clamp-3 hyphens-auto text-lg ">{event.description}</p>
            </header>
            <p className="m-0 mt-auto line-clamp-2 pt-6 text-xs">
              <time
                className={`font-bold ${isFutureEvent(event.dateTime) ? 'text-io_blue-600' : ''}`}
                dateTime={new Intl.DateTimeFormat('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(event.dateTime))}
              >
                {new Intl.DateTimeFormat('en-US', {
                  day: 'numeric',
                  month: 'long',
                }).format(new Date(event.dateTime))}
              </time>
              {' | '}
              {event.groupName}
            </p>
            <Link
              href={event.eventUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-0 left-0 right-0 top-0 text-0"
            >
              Go to page for {event.title}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default EventCarousel
