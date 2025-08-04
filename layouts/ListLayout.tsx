import { useState } from 'react'
import removeMarkdown from 'markdown-to-text'
import Pagination from '@/components/Pagination'
import ContentCard from '@/components/ContentCard'
import type { FrontMatter, AuthorsMap, ThemeColor } from '../types'

interface ListLayoutProps {
  posts: FrontMatter[]
  title: string
  initialDisplayPosts?: FrontMatter[]
  pagination?: any // TODO: Define pagination type
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
              <h1 className="mb-8 text-3xl font-extrabold leading-9 tracking-tight text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                {title}
              </h1>
              <div className="relative">
                <input
                  aria-label="Search articles"
                  type="text"
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search articles"
                  className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
                />
                <svg
                  className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
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
      </section>
      <section className="container mx-auto max-w-2xl">
        <div className="pb-24 pt-6">
          {!filteredBlogPosts.length && 'No posts found.'}
          <ul className="grid grid-cols-1 gap-y-10 lg:gap-y-12">
            {displayPosts.map((frontMatter: FrontMatter, index: number) => {
              const { slug, date, title, summary, tags } = frontMatter
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
