import { getFileBySlug } from '@/lib/mdx'

let serieCache

export async function getSerie(serieID, posts) {
  if (serieCache) {
    return serieCache
  }

  if (!serieID) {
    return null
  }
  const serieResult = await getFileBySlug('series', serieID)
  if (!serieResult) {
    return null
  }

  const seriePosts = posts.filter((post) => post.serie === serieID)

  if (seriePosts?.length) {
    serieCache = {
      ...serieResult.frontMatter,
      posts: seriePosts.sort((a, b) => new Date(a.date) - new Date(b.date)),
    }
  }

  return serieCache
}
