import Mail from './mail.svg'
import Github from './github.svg'
import Facebook from './facebook.svg'
import Youtube from './youtube.svg'
import Linkedin from './linkedin.svg'
import X from './x.svg'
import Instagram from './instagram.svg'
import Web from './web.svg'
import SlideDeck from './slide-deck.svg'
import Link from '../Link'

// Icons taken from: https://simpleicons.org/

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  x: X,
  instagram: Instagram,
  website: Web, // from material ui icons
  'slide-deck': SlideDeck, // from material ui icons
}
import type { SocialIconProps, SocialIconSize } from './types'

// Tailwind can't statically detect `h-${size} w-${size}` template interpolation,
// so each supported size needs to exist as a complete literal class name here.
const sizeClasses: Record<SocialIconSize, string> = {
  5: 'h-5 w-5',
  6: 'h-6 w-6',
  7: 'h-7 w-7',
  8: 'h-8 w-8',
}

const SocialIcon = ({
  kind,
  href,
  size = 8,
  title,
  children,
  classNames,
  textClassNames,
}: SocialIconProps) => {
  if (!href || (kind === 'mail' && !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href)))
    return null

  const SocialSvg = components[kind as keyof typeof components]

  return (
    <Link
      className={`h flex  items-center transition ${
        textClassNames ? textClassNames : 'hover:text-io_energeticBlue-600'
      }`}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      title={title}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`${sizeClasses[size]} hover:text-io_energeticBlue-600 dark:text-gray-200 dark:hover:text-blue-400 ${
          classNames ? classNames : 'fill-current'
        }`}
      />
      {children && <span className={`ml-1`}>{children}</span>}
    </Link>
  )
}

export default SocialIcon
