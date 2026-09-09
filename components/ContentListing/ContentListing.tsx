import ContentCard from '@/components/ContentCard'

import type { ContentListingProps } from './types'
import type { ContentItem, Author } from '../../types'

const ContentListing = ({
  items = [],
  authors = {},
  contentType = 'article',
  layout = 'grid', // 'grid', 'list'
  showArchivedFilter = true,
  className = '',
  containerClassName = 'container mx-auto py-10 lg:py-16',
}: ContentListingProps) => {
  const getGridClasses = () => {
    switch (layout) {
      case 'list':
        return ''
      case 'grid':
      default:
        return 'grid gap-y-10 md:gap-x-4 lg:grid-cols-2 lg:gap-y-12 xl:grid-cols-3 xl:gap-x-6'
    }
  }

  const filteredItems = showArchivedFilter
    ? items.filter((item) => {
        if (!item.authors) return true
        const itemAuthors = item.authors.map((authorSlug) => authors[authorSlug]).filter(Boolean)
        return !itemAuthors.find((author) => author?.archived)
      })
    : items

  const renderItem = (item: ContentItem, index: number) => {
    // Skip items without a slug
    if (!item.slug) return null

    const itemAuthors = item.authors
      ? item.authors
          .map((authorSlug: string) => authors[authorSlug])
          .filter((author): author is Author => Boolean(author))
      : []

    const needsListContainer = ['talk', 'workshop'].includes(contentType)
    const cardLayout = layout === 'list' || needsListContainer ? 'list' : 'default'

    const props = {
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      date: item.date || '',
      tags: item.tags || [],
      authors: itemAuthors,
      border: index !== 0,
      type: contentType,
      layout: cardLayout as 'default' | 'list' | 'compact',
      showReadMore: cardLayout === 'list',
      ...(item.video && { video: item.video }),
      ...(item.slides && { slides: item.slides }),
    }

    if (layout === 'list') {
      return <ContentCard key={item.title || item.slug} {...props} />
    } else {
      return <ContentCard key={item.title || item.slug} {...props} />
    }
  }

  if (filteredItems.length === 0) {
    return (
      <div className={containerClassName}>
        <p className="text-center text-gray-500">No items found.</p>
      </div>
    )
  }

  const needsListContainer = ['talk', 'workshop'].includes(contentType)

  return (
    <div className={containerClassName}>
      {layout === 'list' || needsListContainer ? (
        <ul className={layout === 'grid' ? `${getGridClasses()} ${className}` : className}>
          {filteredItems.map(renderItem)}
        </ul>
      ) : (
        <div className={`${getGridClasses()} ${className}`}>{filteredItems.map(renderItem)}</div>
      )}
    </div>
  )
}

export default ContentListing
