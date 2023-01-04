import Image from '@/components/Image'
import Link from '@/components/Link'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

const Contributor = ({ contributor }) => {
  const { theme } = useBrandingTheme()

  return (
    <Link
      href={`/authors/${contributor.slug[0]}`}
      className={`flex flex-col items-center text-io_${theme}-600 hover:text-io_${theme}-700`}
    >
      <div className="flex-0 md:h-34 md:w-34 relative h-28 w-28 overflow-hidden rounded-full border-4 border-white md:mb-2 lg:h-40 lg:w-40 xl:h-44 xl:w-44">
        <Image
          key={contributor.name}
          src={contributor.avatar}
          width={200}
          height={200}
          alt="avatar"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
      <p>{contributor.name}</p>
    </Link>
  )
}

export default Contributor
