import { useState, useEffect } from 'react'
import { getAllFilesFrontMatter } from '../mdx'
import { getAuthors } from '../authors'
import type { ContentItem } from '../../types'
import type { ContentType } from '../mdx/types'

/**
 * Common pattern for content pages with pagination
 */
export const getContentWithPagination = async (
  contentType: ContentType | string,
  itemsPerPage: number,
  theme: string,
  filter: ((item: ContentItem) => boolean) | null = null,
  transparentHeader = false
) => {
  let content = await getAllFilesFrontMatter(contentType as any)

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
      transparentHeader,
    },
  }
}

/**
 * Get content with authors for display
 */
export const getContentWithAuthors = async (
  contentType: ContentType | string,
  theme: string,
  filter: ((item: ContentItem) => boolean) | null = null,
  transparentHeader = false
) => {
  let content = await getAllFilesFrontMatter(contentType as any)

  // Apply filter if provided
  if (filter) {
    content = content.filter(filter)
  }

  const authors = await getAuthors(content)

  return {
    props: {
      [contentType]: content,
      authors,
      theme,
      transparentHeader,
    },
  }
}

/**
 * Get paginated content for a specific page
 */
export const getPagedContent = async (
  contentType: any,
  page: any,
  itemsPerPage = 10,
  filter: any = null
) => {
  let allContent = await getAllFilesFrontMatter(contentType)

  // Apply filter if provided
  if (filter) {
    allContent = allContent.filter(filter)
  }

  const totalPages = Math.ceil(allContent.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const pageContent = allContent.slice(startIndex, endIndex)

  return {
    posts: pageContent,
    authors: await getAuthors(allContent),
    pagination: {
      currentPage: page,
      totalPages,
    },
    theme: 'blue',
  }
}

/**
 * Hook for managing content state
 */
export const useContentData = (initialData: ContentItem[]) => {
  const [content, setContent] = useState<ContentItem[]>(initialData || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateContent = async (newData: ContentItem[]) => {
    try {
      setLoading(true)
      setContent(newData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const sortContent = (sortFn: (a: ContentItem, b: ContentItem) => number) => {
    setContent((prev) => [...prev].sort(sortFn))
  }

  const filterContent = (filterFn: (item: ContentItem) => boolean) => {
    setContent((prev) => prev.filter(filterFn))
  }

  useEffect(() => {
    if (initialData) {
      setContent(initialData)
    }
  }, [initialData])

  return {
    content,
    loading,
    error,
    updateContent,
    sortContent,
    filterContent,
  }
}

// Helper function to create filter functions
export const createAuthorFilter = (authorSlug: string) => {
  return (post: any) => post.authors && post.authors.includes(authorSlug)
}

export const createTagFilter = (tag: string) => {
  return (post: any) => post.tags && post.tags.includes(tag)
}

export const createDateFilter = (startDate: Date, endDate?: Date) => {
  return (post: any) => {
    if (!post.date) return false
    const postDate = new Date(post.date)
    if (endDate) {
      return postDate >= startDate && postDate <= endDate
    }
    return postDate >= startDate
  }
}
