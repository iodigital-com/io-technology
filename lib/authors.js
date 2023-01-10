import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'

let authorCache

export async function getAuthors(posts) {
  if (authorCache) {
    return authorCache
  }

  const authors = await posts.map(async (post) => {
    const authorList = post.authors || ['default']

    const authorPromise = authorList.map(async (author) => {
      const authorResults = await getFileBySlug('authors', [author])
      const object = { [author]: authorResults.frontMatter }
      return object
    }, {})

    const authors = await Promise.all(authorPromise)
    return authors
  }, {})

  const authorsArray = await Promise.all(authors)

  return authorsArray.reduce((current, authorArray) => {
    const object = authorArray.reduce((curr, author) => ({ ...curr, ...author }))
    return { ...current, ...object }
  }, {})
}

export async function getAllAuthors() {
  const allAuthorsArray = await getAllFilesFrontMatter('authors')
  return allAuthorsArray.map((author) => ({
    ...author,
    slug: [author.slug],
  }))
}

export async function getPostsByAuthor(author) {
  const allPosts = await getAllFilesFrontMatter('blog')
  return allPosts.filter((post) => post.authors.includes(author))
}

export async function getTalksByAuthor(author) {
  const allTalks = await getAllFilesFrontMatter('talks')
  return allTalks.filter((talk) => talk.authors.includes(author))
}
