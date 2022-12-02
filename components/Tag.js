import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

const Tag = ({ text }) => {
  let { theme } = useBrandingTheme()

  if (theme === 'default') {
    theme = 'black'
  }

  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className={`mr-3 mb-2 bg-io_${theme}-600 px-1 text-sm font-medium uppercase text-white hover:bg-white hover:text-io_${theme}-600`}
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
