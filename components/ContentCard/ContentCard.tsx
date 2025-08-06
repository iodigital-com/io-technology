import MarkdownRenderer from 'react-markdown-renderer'
import Link from '@/components/Link'
import formatDate from '@/lib/utils/formatDate'
import Tag from '@/components/Tag'
import SocialIcon from '@/components/social-icons'
import AuthorInfo from '@/components/AuthorInfo'
import Arrow from '@/data/arrow.svg'

import type { ContentCardProps } from './types'

const ContentCard = ({
  slug,
  title,
  summary,
  date,
  tags = [],
  authors = [],
  border = true,
  type = 'article', // 'article', 'talk', 'workshop', 'serie'
  basePath,
  showDate = true,
  showSummary = true,
  showReadMore = false,
  showTags = true,
  showAuthors = true,
  video,
  slides,
  layout = 'default', // 'default', 'list', 'compact'
}: ContentCardProps) => {
  const getBasePath = () => {
    if (basePath) return basePath
    switch (type) {
      case 'talk':
        return '/talks'
      case 'workshop':
        return '/workshops'
      case 'serie':
        return '/series'
      default:
        return '/articles'
    }
  }

  const path = `${getBasePath()}/${slug}`

  const renderListLayout = () => (
    <li className="flex border-b-2 border-gray-100 pb-10">
      <div className="flex flex-col">
        <Link href={path} className="inline-flex">
          <h2 className="teaser-title mb-2 text-3xl">
            <MarkdownRenderer markdown={title} />
          </h2>
        </Link>

        {showSummary && (
          <div className="text-body-xs mb-3">
            <p className="line-clamp-3">{summary}</p>
            {showReadMore && (
              <Link
                href={path}
                aria-label={`Read more about ${title}`}
                className="inline-flex py-2"
              >
                <span>Read more</span>
                <Arrow className="ml-2 w-6" />
              </Link>
            )}
          </div>
        )}

        <div className="flex flex-grow flex-col justify-end">
          {showAuthors && authors.length > 0 && (
            <div className="mb-3">
              <AuthorInfo authors={authors} layout="inline" avatarSize="small" />
            </div>
          )}

          {showTags && tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-3">
              {tags.map((tag) => (
                <div key={tag} className="inline-block whitespace-nowrap">
                  <Tag text={tag} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons for talks/workshops */}
        {(video || slides) && (
          <div className="flex flex-wrap gap-4">
            {video && <SocialIcon kind="youtube" href={video} size="5" title="Video" />}
            {slides && <SocialIcon kind="slide-deck" href={slides} size="8" title="Slides" />}
          </div>
        )}
      </div>
    </li>
  )

  const renderDefaultLayout = () => (
    <article className={`border-gray-300 py-8 ${border && 'border-t'}`}>
      <div className="grid grid-cols-12">
        {showAuthors && authors.length > 0 && (
          <div className="hidden md:col-span-3 md:block xl:col-span-5">
            <AuthorInfo authors={authors} layout="stacked" avatarSize="large" />
          </div>
        )}

        <div
          className={`col-span-full ${
            showAuthors && authors.length > 0 ? 'md:col-start-4 xl:col-start-7' : ''
          }`}
        >
          <Link href={path}>
            <h2 className={`teaser-title mb-2 ${type === 'serie' ? 'text-2xl' : 'text-3xl'}`}>
              <MarkdownRenderer markdown={title} />
            </h2>
            {showSummary && summary && (
              <div className="mb-3 hidden md:block">
                <h3 className="line-clamp-3 hyphens-auto">
                  <MarkdownRenderer markdown={summary} />
                </h3>
              </div>
            )}
          </Link>

          {showDate && date && (
            <dl className="mb-4">
              <dt className="sr-only">Published on</dt>
              <dd className="leading- text-sm font-light">
                <time dateTime={date}>{formatDate(date)}</time>
              </dd>
            </dl>
          )}

          {showTags && tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-3">
              {tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          )}

          {type === 'serie' && (
            <Link href={path}>
              <Arrow className="w-6" />
            </Link>
          )}
        </div>
      </div>
    </article>
  )

  switch (layout) {
    case 'list':
      return renderListLayout()
    case 'compact':
      // Can add a compact layout in the future
      return renderDefaultLayout()
    default:
      return renderDefaultLayout()
  }
}

export default ContentCard
