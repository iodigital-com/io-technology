import { getAllFilesFrontMatter } from '../mdx'
import type { Author, FrontMatter } from '../../types'
import type { AuthorsMap } from './types'

function frontMatterToAuthor(frontMatter: FrontMatter): Author | null {
  // Ensure required fields exist
  if (!frontMatter.title || !frontMatter.slug) return null

  return {
    name: frontMatter.title, // Use title as name for authors
    avatar: frontMatter.images?.[0] || '/default-avatar.jpg',
    slug: Array.isArray(frontMatter.slug) ? frontMatter.slug : [frontMatter.slug],
    occupation: (frontMatter as any).occupation,
    company: (frontMatter as any).company,
    bio: frontMatter.summary,
    social: (frontMatter as any).social,
    archived: frontMatter.draft ?? false,
  }
}

export async function getAllAuthors(): Promise<AuthorsMap> {
  const authorsFrontMatter = await getAllFilesFrontMatter('authors')
  const authors: AuthorsMap = {}

  authorsFrontMatter.forEach((authorFrontMatter) => {
    const slug = authorFrontMatter.slug?.[0] || ''
    const author = frontMatterToAuthor(authorFrontMatter)
    if (slug && author) {
      authors[slug] = author
    }
  })

  return authors
}

export async function getAuthors(frontMatters: FrontMatter[]): Promise<AuthorsMap> {
  const authorSet = new Set<string>()
  frontMatters.forEach((frontMatter) => {
    if (frontMatter.authors) {
      frontMatter.authors.forEach((author: string) => authorSet.add(author))
    }
  })

  const authorArray = Array.from(authorSet)
  const authorsFrontMatter = await getAllFilesFrontMatter('authors')
  const authors: AuthorsMap = {}

  authorArray.forEach((author) => {
    const authorData = authorsFrontMatter.find(
      (authorFrontMatter) => authorFrontMatter.slug?.[0] === author
    )
    if (authorData) {
      const convertedAuthor = frontMatterToAuthor(authorData)
      if (convertedAuthor) {
        authors[author] = convertedAuthor
      }
    }
  })

  return authors
}

export async function getPostsByAuthor(author: string): Promise<FrontMatter[]> {
  const allPosts = await getAllFilesFrontMatter('blog')
  return allPosts.filter((post) => post.authors.includes(author))
}

export async function getTalksByAuthor(author: string): Promise<FrontMatter[]> {
  const allTalks = await getAllFilesFrontMatter('talks')
  return allTalks.filter((talk) => talk.authors.includes(author))
}

export async function getWorkshopsByAuthor(author: string): Promise<FrontMatter[]> {
  const allWorkshops = await getAllFilesFrontMatter('workshops')
  return allWorkshops.filter((workshop) => workshop.authors.includes(author))
}
