import { useState } from 'react'
import removeMarkdown from 'markdown-to-text'
import Pagination from '@/components/Pagination'
import ContentCard from '@/components/ContentCard'
import type { FrontMatter, AuthorsMap, ThemeColor } from '../types'
import type { PaginationMeta } from '../types/api'

interface ListLayoutProps {
  posts: FrontMatter[]
  title: string
  initialDisplayPosts?: FrontMatter[]
  pagination?: PaginationMeta
  authors: AuthorsMap
  theme: ThemeColor
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  authors,
  theme,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((frontMatter: FrontMatter) => {
    const searchContent =
      removeMarkdown(frontMatter.title) + frontMatter.summary + frontMatter.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <section className={`bg-io_${theme}-500`}>
        <div className="container mx-auto mb-12 pb-24 pt-0">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mb-10 md:mt-4 xl:row-start-1 xl:mb-16 xl:mt-12">
              <h1 className="text-4xl md:text-5xl xl:text-7xl">
                <span className="block">{title}</span>
              </h1>
            </div>
            <div className="col-span-full grid grid-cols-12 md:col-span-6 md:col-start-1 lg:col-span-6 lg:col-start-1">
              <div className="col-span-full">
                <div className="relative">
                  <div className="relative flex justify-between py-4">
                    <input
                      type="search"
                      name="search"
                      aria-label="Search articles"
                      placeholder="Search articles"
                      className="w-full px-5 py-5"
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <svg
                      className="absolute right-3 top-9 h-7 w-7 text-gray-400 dark:text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto">
        <div className="pb-24 pt-6">
          {!filteredBlogPosts.length && 'No posts found.'}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayPosts.map((frontMatter: FrontMatter, index: number) => {
              const { slug, date, title, summary, tags, images } = frontMatter
              const authorsResolved = frontMatter.authors
                .map((author) => {
                  return authors[author]
                })
                .filter((author): author is typeof author & {} => Boolean(author)) // Remove undefined authors

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
          {pagination && pagination.totalPages > 1 && !searchValue && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              subpath="articles"
            />
          )}
        </div>
      </section>
    </>
  )
}
