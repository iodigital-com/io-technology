import Image from '@/components/Image'
import Link from '@/components/Link'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

import type { ContributorProps } from './types'

const InnerContributor = ({ contributor }: { contributor: ContributorProps['contributor'] }) => {
  return (
    <>
      <div className="flex-0 md:h-34 md:w-34 relative h-28 w-28 overflow-hidden rounded-full border-4 border-white md:mb-2 lg:h-40 lg:w-40 xl:h-44 xl:w-44">
        <Image
          src={contributor.avatar}
          width={200}
          height={200}
          alt={`Avatar of ${contributor.name}`}
          className="rounded-full object-cover"
        />
      </div>
      <p>{contributor.name}</p>
      <p className="text-sm text-gray-500">{contributor.occupation}</p>
    </>
  )
}

interface FullContributorProps {
  contributor: ContributorProps['contributor']
  link?: boolean
}

const Contributor = ({ contributor, link = true }: FullContributorProps) => {
  const { theme } = useBrandingTheme()

  if (link) {
    return (
      <Link
        href={`/authors/${contributor.slug[0]}`}
        className={`flex flex-col items-center text-center text-io_${theme}-600 hover:text-io_${theme}-700`}
      >
        <InnerContributor contributor={contributor} />
      </Link>
    )
  }

  return (
    <div className={`flex flex-col items-center text-center`}>
      <InnerContributor contributor={contributor} />
    </div>
  )
}

export default Contributor
