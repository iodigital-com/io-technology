import MarkdownRenderer from 'react-markdown-renderer'
import Link from '@/components/Link'
import formatDate from '@/lib/utils/formatDate'
import Tag from '@/components/Tag'
import SocialIcon from '@/components/social-icons'
import AuthorInfo from '@/components/AuthorInfo'
import ReadMoreButton from '@/components/ReadMoreButton'
import Arrow from '@/data/arrow.svg'
import Image1 from '../../public/iO-technology-blog1.png'

import type { ContentCardProps } from './types'

const ContentCard = ({
  slug,
  title,
  summary,
  date,
  tags = [],
  authors = [],
  type = 'article', // 'article', 'talk', 'workshop', 'serie'
  basePath,
  showDate = true,
  showSummary = true,
  showReadMore = false,
  showTags = true,
  showAuthors = true,
  video,
  slides,
  images,
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
  const image = images?.[0]

  // Layout-specific classes
  const isListLayout = layout === 'list'
  const isDefaultLayout = layout === 'default'

  const containerClasses = isListLayout ? 'flex border-b-2 border-gray-100 pb-10' : 'py-8'

  const contentClasses = isListLayout
    ? 'flex flex-col'
    : `flex flex-col justify-between h-full min-h-[400px] col-span-full ${
        showAuthors && authors.length > 0 ? 'md:col-start-4 xl:col-start-7' : ''
      }`

  const titleClasses = isListLayout
    ? 'teaser-title font-semibold mb-2 text-xl'
    : `teaser-title font-semibold ${type === 'serie' ? 'text-lg' : 'text-xl'}`

  const summaryClasses = isListLayout ? 'text-body-xs mb-3' : 'mt-2 hidden md:block'

  const Container = isListLayout ? 'li' : 'article'

  return (
    <Container className={containerClasses}>
      <div className={contentClasses}>
        {/* Header Section */}
        <div className="flex-shrink-0 mb-4">
          {/* Background Image - only for default layout */}
          {isDefaultLayout && (
            <div
              className="w-full mb-4 h-64 bg-cover bg-center"
              style={{
                backgroundImage: image ? `url('${image}')` : `url('${Image1.src}')`,
              }}
              aria-label={title}
              role="img"
            />
          )}

          <Link href={path} className={isListLayout ? 'inline-flex' : ''}>
            <h2 className={titleClasses}>
              <MarkdownRenderer markdown={title} />
            </h2>
            {showSummary && summary && isDefaultLayout && (
              <div className={summaryClasses}>
                <h3 className="line-clamp-3 hyphens-auto">
                  <MarkdownRenderer markdown={summary} />
                </h3>
              </div>
            )}
          </Link>

          {/* Summary for list layout */}
          {showSummary && isListLayout && (
            <div className={summaryClasses}>
              <p className="line-clamp-3">{summary}</p>
            </div>
          )}
        </div>

        {/* Date Section - only for default layout */}
        {showDate && date && isDefaultLayout && (
          <div className="flex-shrink-0 mt-2">
            <dl>
              <dt className="sr-only">Published on</dt>
              <dd className="leading- text-sm font-light">
                <time dateTime={date}>{formatDate(date)}</time>
              </dd>
            </dl>
          </div>
        )}

        {/* Tags Section */}
        {showTags && tags.length > 0 && (
          <div className={`flex-shrink-0 ${isDefaultLayout ? 'mt-4' : 'mb-3'}`}>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <div key={tag} className="inline-block whitespace-nowrap">
                  <Tag text={tag} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content wrapper for list layout */}
        {isListLayout && (
          <div className="flex flex-grow flex-col justify-end">
            {/* Authors Section for list layout */}
            {showAuthors && authors.length > 0 && (
              <div className="mb-3">
                <AuthorInfo authors={authors} layout="inline" avatarSize="small" />
              </div>
            )}

            {/* Action buttons - Read more and video/slides for list layout */}
            {(showReadMore || video || slides) && (
              <div className="flex items-center justify-between mt-4">
                <div>
                  {showReadMore && (
                    <ReadMoreButton
                      href={path}
                      ariaLabel={`Read more about ${title}`}
                      variant="button"
                      size="medium"
                    />
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {video && <SocialIcon kind="youtube" href={video} size="7" title="Video" />}
                  {slides && <SocialIcon kind="slide-deck" href={slides} size="8" title="Slides" />}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Authors Section - only for default layout */}
        {showAuthors && authors.length > 0 && isDefaultLayout && (
          <div className="flex-shrink-0 hidden md:col-span-3 md:block xl:col-span-5 mt-auto mb-4">
            <AuthorInfo authors={authors} layout="inline" avatarSize="small" />
          </div>
        )}

        {/* Action Section - only for default layout */}
        {isDefaultLayout && (
          <div className="flex-shrink-0 mt-4">
            {type === 'article' && (
              <ReadMoreButton
                href={path}
                ariaLabel={`Read more: ${title}`}
                variant="button"
                size="medium"
              />
            )}
            {type === 'serie' && (
              <Link href={path} className="group">
                <Arrow className="w-6 transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
              </Link>
            )}
          </div>
        )}
      </div>
    </Container>
  )
}

export default ContentCard
