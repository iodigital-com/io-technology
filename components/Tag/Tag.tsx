import Link from '../Link'
import kebabCase from '@/lib/utils/kebabCase'

interface TagProps {
  text: string
}

const Tag = ({ text }: TagProps) => {
  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className={`bg-black px-1 text-sm font-medium uppercase text-white hover:bg-white hover:text-black transition-colors`}
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
