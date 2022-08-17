import { useRouter } from 'next/router'
import MarkdownRenderer from 'react-markdown-renderer'

import Link from '@/components/Link'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

const SeriePlaylist = ({ serie }) => {
  const { title, posts, slug } = serie

  const { theme } = useBrandingTheme()
  const router = useRouter()

  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <h4 className="teaser-title text-md font-medium text-gray-600">
        <Link href={`/series/${slug}`}>
          <div
            className={`text-io_${theme}-600 hover:text-io_${theme}-700 dark:hover:text-primary-400`}
          >
            <MarkdownRenderer markdown={title} />
          </div>
        </Link>
      </h4>
      <hr className="my-2" />
      <ol className="flex flex-col gap-4 pt-2">
        {posts.map(({ slug, title }, index) => (
          <li key={slug}>
            <Link href={`/articles/${slug}`}>
              <div
                className={`text-io_${theme}-600 hover:text-io_${theme}-700 dark:hover:text-primary-400 ${
                  router.asPath === `/articles/${slug}`
                    ? `bg-io_${theme}-100 -m-2 rounded-lg p-2`
                    : ''
                }`}
              >
                <strong className="font-bold">Part {index + 1}: </strong>
                <MarkdownRenderer markdown={title} />
              </div>
            </Link>
          </li>
        ))}
      </ol>
      {posts.length === 1 && (
        <p className="mt-4 text-center text-gray-400">Next article coming soon!</p>
      )}
    </div>
  )
}

export default SeriePlaylist
