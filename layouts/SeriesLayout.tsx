import Pagination from '@/components/Pagination'
import ContentCard from '@/components/ContentCard'
import type { FrontMatter, AuthorsMap } from '../types'
import type { PaginationMeta } from '../types/api'

interface SeriesLayoutProps {
  series: FrontMatter[]
  authors: AuthorsMap
  pagination?: PaginationMeta
  subpath?: string
  searchValue?: string
}

export default function ListLayout({
  series,
  authors,
  pagination,
  subpath,
  searchValue = '',
}: SeriesLayoutProps) {
  return (
    <>
      <div className="container mx-auto">
        <ul>
          {!series.length && 'No series found.'}
          {series.map((frontMatter, index) => {
            const { slug, date, title, tags } = frontMatter
            const authorsResolved = frontMatter.authors
              .map((author) => {
                return authors[author]
              })
              .filter((author): author is typeof author & {} => Boolean(author)) // Remove undefined authors

            // Skip if essential fields are null
            if (!slug || !date) return null

            return (
              <li key={slug}>
                <ContentCard
                  key={slug}
                  slug={slug}
                  date={date}
                  title={title}
                  tags={tags}
                  authors={authorsResolved}
                  border={index !== 0}
                  type="serie"
                  basePath={`/${subpath}`}
                />
              </li>
            )
          })}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && subpath && (
        <div className="container mx-auto">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            subpath={subpath}
          />
        </div>
      )}
    </>
  )
}
