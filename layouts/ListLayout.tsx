import Pagination from '@/components/Pagination'
import ContentCard from '@/components/ContentCard'
import type { ContentItem, AuthorsMap } from '../types'
import type { PaginationMeta } from '../types/api'

interface ListLayoutProps {
  posts: ContentItem[]
  authors: AuthorsMap
  pagination?: PaginationMeta
  subpath?: string
  searchValue?: string
}

export default function ListLayout({
  posts,
  authors,
  pagination,
  subpath,
  searchValue = '',
}: ListLayoutProps) {
  return (
    <section className="container mx-auto">
      <div className="pb-24 pt-6">
        {!posts.length && 'No posts found.'}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((frontMatter: ContentItem, index: number) => {
            const { slug, date, title, summary, tags, images } = frontMatter
            const authorsResolved = frontMatter.authors
              .map((author) => authors[author])
              .filter((author): author is typeof author & {} => Boolean(author))

            return (
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
