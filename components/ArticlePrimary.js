import MarkdownRenderer from 'react-markdown-renderer'
import Link from '@/components/Link'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import Image from '@/components/Image'

const ArticlePrimary = ({ slug, title, summary, authors }) => {
  const { theme } = useBrandingTheme()

  return (
    <article className={`container mx-auto grid grid-cols-12`}>
      <div className={`col-span-full md:col-end-9`}>
        <Link href={`/articles/${slug}`}>
          <h2 className="mb-2 text-3xl font-medium md:mb-4 md:text-6xl">
            {<MarkdownRenderer markdown={title} />}
          </h2>
          <div className="mb-2 md:mb-4">
            <h3 className="hyphens-auto line-clamp-3 md:text-xl">
              {<MarkdownRenderer markdown={summary} />}
            </h3>
          </div>
        </Link>

        <div className="mb-4 xl:mb-10">
          <Link
            href={`/articles/${slug}`}
            aria-label="Read whole article"
            className={`bg-io_${theme}-600 relative inline-flex rounded-full py-4 px-9 text-base font-bold leading-none text-white transition-colors delay-100 hover:bg-white hover:text-io_${theme}-600`}
          >
            <span>Read whole article</span>
          </Link>
        </div>

        <div className="col-span-full hidden md:col-end-9 md:block">
          <div className="flex flex-row gap-4">
            <div className="flex items-center -space-x-6 xl:-space-x-12">
              {authors.map((author, index) => (
                <div
                  key={author.name}
                  className="flex-0 relative overflow-hidden rounded-full border-4 border-transparent md:h-16 md:w-16 xl:h-32 xl:w-32"
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
            {authors.map((author) => (
              <div className="xl:text-2xl" key={author.name}>
                <p className="mb-0">
                  <Link href={`/authors/${author.slug[0]}`} className="font-semibold">
                    by {author.name}
                  </Link>
                </p>
                <p className="mb-0">{author.occupation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default ArticlePrimary
