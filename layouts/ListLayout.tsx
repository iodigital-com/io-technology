import Pagination from '@/components/Pagination'
import ContentCard from '@/components/ContentCard'
import type { ContentItem, AuthorsMap } from '../types'
import type { PaginationMeta } from '../types/api'
import PromoCard from '@/components/PromoCard'
import { PromoCardProps } from '@/components/PromoCard/PromoCard'

interface PromoCardConfig extends PromoCardProps {
  index: number
}

interface ListLayoutProps {
  posts: ContentItem[]
  authors: AuthorsMap
  pagination?: PaginationMeta
  subpath?: string
  searchValue?: string
  promoCard?: PromoCardConfig
}

export default function ListLayout({
  posts,
  authors,
  pagination,
  subpath,
  searchValue = '',
  promoCard,
}: ListLayoutProps) {
  // Drop one post when promoCard is provided so the grid keeps the same total item count
  const postsToRender = promoCard ? posts.slice(0, -1) : posts

  return (
    <section className="container mx-auto">
      <div className="pb-24 pt-6">
        {!posts.length && 'No posts found.'}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {postsToRender.flatMap((frontMatter: ContentItem, index: number) => {
            const { slug, date, title, summary, tags, images } = frontMatter
            const authorsResolved = frontMatter.authors
              .map((author) => authors[author])
              .filter((author): author is typeof author & {} => Boolean(author))

            const contentCard = (
              <ContentCard
                key={slug}
                slug={slug || ''}
                date={date || ''}
                title={title}
                summary={summary}
                tags={tags || []}
                authors={authorsResolved}
                border={index !== 0}
                type="article"
                {...(images && { images })}
              />
            )

            if (promoCard && index === promoCard.index) {
              const { index: _index, ...promoCardProps } = promoCard
              return [
                <>
                  <PromoCard {...promoCardProps} />
                </>,
                contentCard,
              ]
            }

            return [contentCard]
          })}
        </ul>
        {pagination && pagination.totalPages > 1 && !searchValue && subpath && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            subpath={subpath}
          />
        )}
      </div>
    </section>
  )
}
