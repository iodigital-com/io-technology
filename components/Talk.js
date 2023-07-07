import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import MarkdownRenderer from 'react-markdown-renderer'
import Link from '@/components/Link'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import Arrow from '@/data/arrow.svg'

const Talk = ({ title, summary, authors, tags, video, slides, slug }) => {
  const { theme } = useBrandingTheme()

  return (
    <li className="flex border-b-2 border-gray-100 pb-10">
      <div className="flex flex-col">
        <Link href={`/talks/${slug}`} className="inline-flex">
          <h2 className="teaser-title mb-2 text-3xl">{<MarkdownRenderer markdown={title} />}</h2>
        </Link>
        <div className="text-body-xs mb-3">
          <p className="line-clamp-3">{summary}</p>
          <Link
            href={`/talks/${slug}`}
            aria-label={`Read more about ${title}`}
            className="inline-flex py-2"
          >
            <span>Read more</span>
            <Arrow className="ml-2 w-6" />
          </Link>
        </div>

        <div className="flex flex-grow flex-col justify-end">
          {authors?.map((author) => (
            <div className="mt-2 mb-3 flex items-center text-lg" key={author.name}>
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
                <p className="text-sm font-medium">
                  <Link>
                    <a
                      href={`/authors/${author.slug[0]}`}
                      className={`text-io_${theme}-600 hover:text-io_${theme}-700`}
                    >
                      {author.name}
                    </a>
                  </Link>
                </p>
                <p className="text-sm">{author.occupation}</p>
              </div>
            </div>
          ))}

          <div className="mb-3 flex flex-wrap gap-3">
            {tags.length > 0 &&
              tags.map((tag) => (
                <div key={tag} className="inline-block whitespace-nowrap">
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
            </>
          )}
          {slides && (
            <>
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
