import MarkdownRenderer from 'react-markdown-renderer'
import Image from '@/components/Image'
import Link from '@/components/Link'
import formatDate from '@/lib/utils/formatDate'
import Tag from '@/components/Tag'
import Arrow from '@/data/arrow.svg'

const Article = ({ slug, date, title, tags, authors, border = true }) => (
  <article className={`border-gray-300 py-8 ${border && 'border-t'}`}>
    <div className="grid grid-cols-12">
      <div className="hidden md:col-span-3 md:block xl:col-span-5">
        <div className="flex flex-col xl:flex-row">
          <div className="flex-0 relative overflow-hidden rounded-full md:mb-4 md:h-16 md:w-16 xl:mr-7 xl:mb-0 xl:h-32 xl:w-32">
            {authors.slice(0, 1).map((author) => {
              return (
                <Image
                  key={author.name}
                  src={author.avatar}
                  width={200}
                  height={200}
                  alt="avatar"
                  objectFit="cover"
                  className="rounded-full"
                />
              )
            })}
          </div>
          <div className="text-body-xs">
            <p className="mb-0">By {authors[0].name}</p>
            <p className="mb-0">{authors[0].occupation}</p>
          </div>
        </div>
      </div>
      <div className="col-span-full md:col-start-4 xl:col-start-7">
        <Link href={`/articles/${slug}`}>
          <h2 className="post-title post-title--teaser text-2xl">
            {<MarkdownRenderer markdown={title} />}
          </h2>
        </Link>
        <dl className="mb-4">
          <dt className="sr-only">Published on</dt>
          <dd className="leading- text-sm font-light">
            <time dateTime={date}>{formatDate(date)}</time>
          </dd>
        </dl>
        <div className="mb-6 flex flex-wrap">
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

export default Article
