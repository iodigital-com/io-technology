import Link from './Link'
import kebabCase from '@/lib/utils/kebabCase'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

const Tag = ({ text }) => {
  let { theme } = useBrandingTheme()

  if (theme === 'default') {
    theme = 'green'
  }

  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className={`bg-io_${theme}-600 px-2 text-sm font-medium uppercase text-white hover:bg-white hover:text-io_${theme}-600 rounded-full`}
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
