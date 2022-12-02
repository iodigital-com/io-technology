import SocialIcon from '@/components/social-icons'
import Image from 'next/image'
import Tag from '@/components/Tag'
import MarkdownRenderer from 'react-markdown-renderer'
import Link from '@/components/Link'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

const Talk = ({ title, summary, authors, tags, video, slides }) => {
  const { theme } = useBrandingTheme()

  return (
    <li className="flex border-b-2 border-gray-100 pb-10">
      <div className="flex flex-col">
        <h2 className="teaser-title mb-2 text-3xl">{<MarkdownRenderer markdown={title} />}</h2>
        <div className="text-body-xs mb-3">
          <p>{summary}</p>
        </div>

        <div className="flex flex-grow flex-col justify-end">
          {authors &&
            authors.map((author) => (
              <div className="mt-2 mb-3 flex items-center text-lg" key={author.name}>
                <div className="flex-0 relative mr-3 inline-block h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    key={author.name}
                    src={author.avatar || '/authors/io.jpg'}
                    width={100}
                    height={100}
                    alt={`avatar ${author.name}`}
                    className="rounded-full"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">
                    <Link
                      href={`/authors/${author.slug[0]}`}
                      className={`text-io_${theme}-600 hover:text-io_${theme}-700`}
                    >
                      {author.name}
                    </Link>
                  </p>
                  <p className="text-sm text-black">{author.occupation}</p>
                </div>
              </div>
            ))}

          <div className="mb-3 flex flex-nowrap gap-1 line-clamp-1">
            {tags.length > 0 &&
              tags.map((tag) => (
                <div key={tag} className="inline-block">
                  <Tag key={tag} text={tag} />
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {video && (
            <>
              <dt className="sr-only">Video</dt>
              <dd>
                <SocialIcon kind="youtube" href={video} size="5" title="Video" />
              </dd>
              <dt className="sr-only">Slides</dt>
              <dd>
                <SocialIcon kind="slide-deck" href={slides} size="8" title="Slides" />
              </dd>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

export default Talk
