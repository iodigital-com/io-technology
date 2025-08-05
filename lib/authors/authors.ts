import { getAllFilesFrontMatter } from '../mdx'
import type { Author, FrontMatter } from '../../types'
import type { AuthorsMap } from './types'

function frontMatterToAuthor(frontMatter: FrontMatter): Author | null {
  // Ensure required fields exist (authors use 'name' field, not 'title')
  const authorName = (frontMatter as any).name || frontMatter.title
  if (!authorName || !frontMatter.slug) return null

  const author: any = {
    name: authorName,
    avatar: frontMatter.images?.[0] || (frontMatter as any).avatar || '/default-avatar.jpg',
    slug: [Array.isArray(frontMatter.slug) ? frontMatter.slug.join('') : frontMatter.slug],
    archived: frontMatter.draft ?? false,
  }

  // Only add optional properties if they have values
  if ((frontMatter as any).occupation) {
    author.occupation = (frontMatter as any).occupation
  }
  if ((frontMatter as any).company) {
    author.company = (frontMatter as any).company
  }
  if (frontMatter.summary) {
    author.bio = frontMatter.summary
  }
  if ((frontMatter as any).social) {
    author.social = (frontMatter as any).social
  }

  return author
}

export async function getAllAuthors(): Promise<Author[]> {
  const authorsFrontMatter = await getAllFilesFrontMatter('authors')
  const authors: Author[] = []

  authorsFrontMatter.forEach((authorFrontMatter) => {
    const author = frontMatterToAuthor(authorFrontMatter)
    if (author) {
      authors.push(author)
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
    const authorData = authorsFrontMatter.find((authorFrontMatter) => {
      // Handle both string and array slug formats
      const authorSlug = Array.isArray(authorFrontMatter.slug)
        ? authorFrontMatter.slug[0]
        : authorFrontMatter.slug
      return authorSlug === author
    })
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
