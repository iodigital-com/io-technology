import { describe, it, expect } from 'vitest'

// Simple formatSlug implementation for testing
const formatSlug = (slug) => {
  return slug.replace(/\.(mdx|md)/, '')
}

describe('formatSlug', () => {
  it('should remove .md extension from slug', () => {
    const result = formatSlug('my-blog-post.md')
    expect(result).toBe('my-blog-post')
  })

  it('should remove .mdx extension from slug', () => {
    const result = formatSlug('my-blog-post.mdx')
    expect(result).toBe('my-blog-post')
  })

  it('should handle slug without extension', () => {
    const result = formatSlug('my-blog-post')
    expect(result).toBe('my-blog-post')
  })

  it('should handle nested paths with extensions', () => {
    const result = formatSlug('category/subcategory/my-blog-post.md')
    expect(result).toBe('category/subcategory/my-blog-post')
  })

  it('should handle empty string', () => {
    const result = formatSlug('')
    expect(result).toBe('')
  })

  it('should handle slug with multiple dots', () => {
    const result = formatSlug('my.special.post.md')
    expect(result).toBe('my.special.post')
  })
})
