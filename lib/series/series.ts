import { getAllFilesFrontMatter } from '../mdx'
import type { SerieData } from './types'
import type { FrontMatter } from '../../types'

export async function getSerie(serieID: string, posts: FrontMatter[]): Promise<SerieData> {
  const allSeries = await getAllFilesFrontMatter('series')

  const serieIndex = allSeries.findIndex((serie) => serie.slug === serieID)
  if (serieIndex === -1) {
    throw new Error(`Serie with ID "${serieID}" not found`)
  }

  const { title, description = '' } = allSeries[serieIndex] || { title: '', description: '' }
  const seriePosts = posts.filter((post) => post.serie === serieID)

  return {
    title: String(title),
    description: String(description),
    posts: seriePosts.sort(
      (a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime()
    ),
  }
}
