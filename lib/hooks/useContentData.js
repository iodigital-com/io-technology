import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getAuthors } from '@/lib/authors'
import sortCreation from '@/lib/utils/sortCreation'

/**
 * Common pattern for content pages with pagination
 */
export const getContentWithPagination = async (
  contentType,
  itemsPerPage = 10,
  theme = 'beige',
  filter = null
) => {
  let content = await getAllFilesFrontMatter(contentType)

  // Apply filter if provided
  if (filter) {
    content = content.filter(filter)
  }

  const initialDisplayItems = content.slice(0, itemsPerPage)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(content.length / itemsPerPage),
  }
  const authors = await getAuthors(content)

  return {
    props: {
      [contentType]: content,
      [`initialDisplay${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`]:
        initialDisplayItems,
      pagination,
      authors,
      theme,
    },
  }
}

/**
 * Common pattern for paginated content (page/[page].js files)
 */
export const getPaginatedContent = async (
  contentType,
  page,
  itemsPerPage = 10,
  theme = 'beige'
) => {
  const content = await getAllFilesFrontMatter(contentType)
  const pageNumber = parseInt(page)
  const initialDisplayItems = content.slice(
    itemsPerPage * (pageNumber - 1),
    itemsPerPage * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(content.length / itemsPerPage),
  }
  const authors = await getAuthors(content)

  return {
    props: {
      [contentType]: content,
      [`initialDisplay${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`]:
        initialDisplayItems,
      pagination,
      authors,
      theme,
    },
  }
}

/**
 * Common pattern for sorted content without pagination
 */
export const getSortedContent = async (contentType, theme = 'pink') => {
  const content = await getAllFilesFrontMatter(contentType)
  const sortedContent = content.sort(sortCreation)
  const authors = await getAuthors(content)

  return {
    props: {
      [contentType]: sortedContent,
      authors,
      theme,
    },
  }
}

/**
 * Generate static paths for paginated content
 */
export const getPaginatedPaths = async (contentType, itemsPerPage = 10) => {
  const content = await getAllFilesFrontMatter(contentType)
  const totalPages = Math.ceil(content.length / itemsPerPage)
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}
