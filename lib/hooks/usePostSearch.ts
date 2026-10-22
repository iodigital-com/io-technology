import { ContentItem } from '../../types'
import { useState } from 'react'
import removeMarkdown from 'markdown-to-text'

export function usePostSearch(posts: ContentItem[]) {
  const [searchValue, setSearchValue] = useState('')
  const filteredPosts = posts.filter((frontMatter) => {
    const searchContent =
      removeMarkdown(frontMatter.title) + frontMatter.summary + frontMatter.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })
  return { searchValue, setSearchValue, filteredPosts }
}
