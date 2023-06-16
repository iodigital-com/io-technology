import MarkdownRenderer from 'react-markdown-renderer'
import Image from '@/components/Image'
import Link from '@/components/Link'
import formatDate from '@/lib/utils/formatDate'
import Tag from '@/components/Tag'
import Arrow from '@/data/arrow.svg'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

const Article = ({ slug, date, title, summary, tags, authors, border = true }) => {
  const { theme } = useBrandingTheme()

  return (
    <article className={`border-gray-300 py-8 ${border && 'border-t'}`}>
      <div className="grid grid-cols-12">
        {authors && (
          <div className="hidden md:col-span-3 md:block xl:col-span-5">
            <div className="flex flex-col gap-4 xl:flex-row">
              <div className="flex items-center -space-x-6 xl:-space-x-12">
                {authors.map((author, index) => (
                  <div
                    key={author.name}
                    className="flex-0 relative overflow-hidden rounded-full border-4 border-white md:mb-4 md:h-16 md:w-16 xl:h-32 xl:w-32"
                    style={{ zIndex: authors.length - index }}
                  >
                    <Image
                      key={author.name}
                      src={author.avatar}
                      width={200}
                      height={200}
                      alt="avatar"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                ))}
              </div>
              <div>
                {authors.map((author) => (
                  <div className="text-body-xs mb-2" key={author.name}>
                    <p className="mb-0">
                      <Link
                        href={`/authors/${author.slug[0]}`}
                        className={`text-io_${theme}-600 hover:text-io_${theme}-700`}
                      >
                        {author.name}
                      </Link>
                    </p>
                    <p className="mb-0">{author.occupation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className={`col-span-full ${authors ? 'md:col-start-4 xl:col-start-7' : ''}`}>
          <Link href={`/articles/${slug}`}>
            <h2 className="teaser-title mb-2 text-3xl">{<MarkdownRenderer markdown={title} />}</h2>
            <div className="mb-3 hidden md:block">
              <h3 className="hyphens-auto line-clamp-3">
                {<MarkdownRenderer markdown={summary} />}
              </h3>
            </div>
          </Link>
          <dl className="mb-4">
            <dt className="sr-only">Published on</dt>
            <dd className="leading- text-sm font-light">
              <time dateTime={date}>{formatDate(date)}</time>
            </dd>
          </dl>
          <div className="mb-6 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
          <Link href={`/articles/${slug}`}>
            <Arrow className="w-6" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default Article
