import Image from '@/components/Image'
import Tag from '@/components/Tag'
import MarkdownRenderer from 'react-markdown-renderer'
import Link from '@/components/Link'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

const Talk = ({ title, summary, author, tags }) => {
  const { theme } = useBrandingTheme()

  return (
    <li className="flex border-b-2 border-gray-100 pb-10">
      <div className="flex flex-col">
        <h2 className="teaser-title mb-2 text-3xl">{<MarkdownRenderer markdown={title} />}</h2>
        <div className="text-body-xs mb-3">
          <p>{summary}</p>
        </div>

        <div className="flex flex-grow flex-col justify-end">
          <div className="mt-2 mb-3 flex items-center text-lg">
            <div className="flex-0 relative mr-3 inline-block h-10 w-10 overflow-hidden rounded-full">
              <Image
                key={author.name}
                src={author.avatar || '/authors/io.jpg'}
                width="100%"
                height="100%"
                alt={`avatar ${author.name}`}
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-black">
                <Link>
                  <a
                    href={`/authors/${author.slug[0]}`}
                    className={`text-io_${theme}-600 hover:text-io_${theme}-700`}
                  >
                    {author.name}
                  </a>
                </Link>
              </p>
              <p className="text-sm text-black">{author.occupation}</p>
            </div>
          </div>

          <div className="mb-3 flex flex-nowrap gap-1 line-clamp-1">
            {tags.length > 0 &&
              tags.map((tag) => (
                <div key={tag} className="inline-block">
                  <Tag key={tag} text={tag} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </li>
  )
}

export default Talk
