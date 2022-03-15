import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href, unoptimized = false }) => (
  <div
    className={`${
      imgSrc && 'h-full'
    }  overflow-hidden rounded-md border-2 border-black border-opacity-100`}
  >
    {imgSrc &&
      (href ? (
        <Link href={href} aria-label={`Link to ${title}`}>
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48"
            width={544}
            height={306}
            unoptimized={unoptimized}
          />
        </Link>
      ) : (
        <Image
          alt={title}
          src={imgSrc}
          className="object-cover object-center md:h-36 lg:h-48"
          width={544}
          height={306}
          unoptimized={unoptimized}
        />
      ))}
    <div className="p-6">
      <h2 className="mb-3 text-2xl font-bold leading-6 tracking-tight">
        {href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h2>
      <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
      {href && (
        <Link
          href={href}
          className="relative bottom-0 text-base font-medium leading-6 text-amber-600 hover:text-amber-700"
          aria-label={`Link to ${title}`}
        >
          Learn more &rarr;
        </Link>
      )}
    </div>
  </div>
)

export default Card
