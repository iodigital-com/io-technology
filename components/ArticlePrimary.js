import MarkdownRenderer from 'react-markdown-renderer'
import Link from '@/components/Link'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import Image from '@/components/Image'

const ArticlePrimary = ({ slug, title, summary, authors }) => {
  const { theme } = useBrandingTheme()

  // Todo: add content
  // Todo: add animated background
  return (
    <article className={`container mx-auto grid grid-cols-12`}>
      <div className={`col-span-full md:col-end-9`}>
        <Link href={`/articles/${slug}`}>
          <h2 className="mb-2 text-3xl font-medium md:mb-4 md:text-6xl">
            {<MarkdownRenderer markdown={title} />}
          </h2>
          <div className="mb-10 hidden md:block">
            <h3 className="hyphens-auto text-xl line-clamp-3">
              {<MarkdownRenderer markdown={summary} />}
            </h3>
          </div>
        </Link>

        <div className="mb-10">
          <button
            className={`rounded-full bg-io_${theme}-600 py-4 px-9 text-base font-bold leading-none text-white`}
            type="button"
            aria-label="Read the article"
          >
            Read whole article
          </button>
        </div>

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
                      className={`text-io_${theme}-600 hover:text-io_${theme}-800`}
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
      </div>
    </article>
  )
}

export default ArticlePrimary
