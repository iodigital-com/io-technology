import ContentCard from '@/components/ContentCard'

const ContentListing = ({
  items = [],
  authors = {},
  contentType = 'article',
  layout = 'grid', // 'grid', 'list'
  showArchivedFilter = true,
  className = '',
  containerClassName = 'container mx-auto py-10 lg:py-16',
}) => {
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
        const itemAuthors = item.authors.map((authorSlug) => authors[authorSlug])
        return !itemAuthors.find((author) => author?.archived)
      })
    : items

  const renderItem = (item, index) => {
    const itemAuthors = item.authors
      ? item.authors.map((authorSlug) => authors[authorSlug]).filter(Boolean)
      : []

    const needsListContainer = ['talk', 'workshop'].includes(contentType)
    const cardLayout = layout === 'list' || needsListContainer ? 'list' : 'default'

    const props = {
      key: item.title || item.slug,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      date: item.date,
      tags: item.tags || [],
      authors: itemAuthors,
      border: index !== 0,
      type: contentType,
      layout: cardLayout,
      showReadMore: cardLayout === 'list',
      video: item.video,
      slides: item.slides,
    }

    if (layout === 'list') {
      return <ContentCard {...props} />
    } else {
      return <ContentCard {...props} />
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
