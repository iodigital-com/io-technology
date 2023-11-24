import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

const Tag = ({ text }) => {
  let { theme } = useBrandingTheme()

  if (theme === 'default') {
    theme = 'green'
  }

  return (
    <Link href={`/tags/${kebabCase(text)}`}>
      <a
        className={`bg-io_${theme}-600 px-1 text-sm font-medium uppercase text-white hover:bg-white hover:text-io_${theme}-600`}
      >
        {text.split(' ').join('-')}
      </a>
    </Link>
  )
}

export default Tag
