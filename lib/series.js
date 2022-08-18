import { getFileBySlug } from '@/lib/mdx'

let serieCache

export async function getSerie(serieID, posts) {
  if (!serieID) {
    return null
  }
  const serieResult = await getFileBySlug('series', serieID)
  if (!serieResult) {
    return null
  }

  const seriePosts = posts.filter((post) => post.serie === serieID)

  return {
    ...serieResult.frontMatter,
    posts: seriePosts.sort((a, b) => new Date(a.date) - new Date(b.date)),
  }
}
