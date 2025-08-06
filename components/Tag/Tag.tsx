import Link from '../Link'
import kebabCase from '@/lib/utils/kebabCase'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

interface TagProps {
  text: string
}

const Tag = ({ text }: TagProps) => {
  let { theme } = useBrandingTheme()

  // Fallback to green if theme is undefined or null
  if (!theme) {
    theme = 'green'
  }

  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className={`bg-io_${theme}-600 px-1 text-sm font-medium uppercase text-white hover:bg-white hover:text-io_${theme}-600`}
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
