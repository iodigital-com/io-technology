import Link from 'next/link'
import Image from '@/components/Image'
import formatDate from '@/lib/utils/formatDate'

export default function Hero({ image, title, date, authors, src }) {
  return (
    <header className="relative">
      <dl className="space-y-10">
        <div>
          <dt className="sr-only">Published on</dt>
          <dd className="text-right text-base font-medium leading-6"></dd>
        </div>
      </dl>
      {image && (
        <Image
          src={image}
          alt={title}
          width={1200}
          height={627}
          layout="responsive"
          priority={true}
        />
      )}
      <div className="space-y-1 text-center">
        <div className="absolute bottom-0 w-full bg-black/[.2] p-10 text-right text-3xl font-bold leading-8">
          {src ? (
            <h2 className="absolute left-0 bottom-0 w-full bg-black/[.2] p-10 text-right text-3xl font-bold leading-8">
              <Link href={src} className="">
                {title}
              </Link>
              <p>
                <time className="text-sm" dateTime={date}>
                  {formatDate(date)}
                </time>
              </p>
            </h2>
          ) : (
            <h2 className="text-white">
              <span>{title}</span>
              <p>
                <time className="text-sm" dateTime={date}>
                  {formatDate(date)}
                </time>
              </p>
            </h2>
          )}
        </div>
      </div>
      {authors.map((author) => {
        return (
          <div key={author.name} className="absolute top-10 right-10">
            <Image
              key={author.name}
              src={author.avatar}
              width="100px"
              height="100px"
              alt="avatar"
              className="h-10 w-10 rounded-full"
            />
          </div>
        )
      })}
    </header>
  )
}
