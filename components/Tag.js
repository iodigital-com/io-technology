import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link href={`/tags/${kebabCase(text)}`}>
      <a className="mr-3 bg-amber-600 px-1 text-sm font-medium uppercase text-white hover:bg-white hover:text-amber-600">
        {text.split(' ').join('-')}
      </a>
    </Link>
  )
}

export default Tag
