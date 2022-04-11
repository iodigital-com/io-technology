import { useState } from 'react'
import Pagination from '@/components/Pagination'
import Article from '@/components/Article'
import Image from '@/components/Image'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  authors,
  theme,
}) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((frontMatter) => {
    const searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  const textClass = theme === 'default' ? 'text-black' : 'text-white'

  return (
    <>
      <section className={`bg-io_${theme}-500 ${textClass}`}>
        <div className="container mx-auto mb-12 pt-8 pb-24 md:pb-32 xl:pb-40">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mt-4 md:mb-10 xl:row-start-1 xl:mt-12 xl:mb-16">
              <h1 className="text-4xl md:text-5xl xl:text-7xl">
                <span className="block">{title}</span>
              </h1>
            </div>
            <div className="grid-col-12 col-span-full grid md:col-span-6 md:col-start-1 lg:col-span-6 lg:col-start-1">
              <div className="col-span-full">
                <div className="relative">
                  <div className="rounded-[1px] border border-b-0 bg-white px-5 xl:px-6">
                    <div className="relative flex justify-between border-b py-4">
                      <input
                        type="search"
                        name="search"
                        placeholder="Search articles"
                        className="w-full text-black"
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                      <svg
                        className="absolute right-3 top-6 h-7 w-7 text-gray-400 dark:text-gray-300"
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
        </div>
      </section>

      <div className="container mx-auto">
        <ul>
          {!filteredBlogPosts.length && 'No articles found.'}
          {displayPosts.map((frontMatter) => {
            const { slug, date, title, tags } = frontMatter
            const authorsResolved = frontMatter.authors.map((author) => {
              return authors[author]
            })

            return (
              <li key={slug} className="py-4">
                <Article
                  key={slug}
                  slug={slug}
                  date={date}
                  title={title}
                  tags={tags}
                  authors={authorsResolved}
                />
              </li>
            )
          })}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
