import { getFileBySlug } from '@/lib/mdx'

let authorCache

export async function getAuthors(posts) {
  console.log(authorCache)
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
