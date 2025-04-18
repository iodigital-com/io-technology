import MarkdownRenderer from 'react-markdown-renderer'
import Image from '@/components/Image'
import Link from '@/components/Link'
import formatDate from '@/lib/utils/formatDate'
import Tag from '@/components/Tag'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

const Article = ({ slug, date, title, summary, tags, authors, images, border = true }) => {
  const { theme } = useBrandingTheme()

  return (
    <article className="flex flex-col h-full">
      <Link
        href={`/articles/${slug}`}
        className="group relative mb-4 block aspect-[4/3] w-full overflow-hidden"
      >
        <Image
          src={images?.[0] || '/static/images/default-cover.jpg'}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={600}
          height={400}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </Link>

      <div className="flex flex-col flex-grow">
        <div className="mb-2">
          {authors && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {authors.map((author, index) => (
                  <div
                    key={author.name}
                    className="relative overflow-hidden rounded-full border-2 border-white h-6 w-6"
                    style={{ zIndex: authors.length - index }}
                  >
                    <Image
                      src={author.avatar}
                      width={24}
                      height={24}
                      alt={author.name}
                      className="rounded-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 text-sm text-gray-600">
                {authors.map((author, index) => (
                  <Link
                    key={author.name}
                    href={`/authors/${author.slug[0]}`}
                    className={`hover:text-io_${theme}-800`}
                  >
                    {author.name}
                    {index < authors.length - 1 ? ', ' : ''}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link href={`/articles/${slug}`} className="group">
          <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
            <MarkdownRenderer markdown={title} />
          </h2>
          <div className="mb-3 text-gray-600 text-sm line-clamp-2">
            <MarkdownRenderer markdown={summary} />
          </div>
        </Link>

        <div className="mt-auto">
          <div className="mb-4">
            <time className="text-sm text-gray-500" dateTime={date}>
              {formatDate(date)}
            </time>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default Article
