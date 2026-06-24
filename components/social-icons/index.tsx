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
import type { SocialIconProps } from './types'

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
        className={`h-${size} w-${size} hover:text-io_energeticBlue-600 dark:text-gray-200 dark:hover:text-blue-400 ${
          classNames ? classNames : 'fill-current'
        }`}
      />
      {children && <span className={`ml-1`}>{children}</span>}
    </Link>
  )
}

export default SocialIcon
