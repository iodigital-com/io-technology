import { escape } from '@/lib/utils/htmlEscaper'
import { getAuthors } from '@/lib/authors'
import type { FrontMatter, AuthorsMap } from '../types'

import siteMetadata from '@/data/siteMetadata'

const generateRssItem = (post: FrontMatter, authors: AuthorsMap): string => `
    <item>
      <guid>${siteMetadata.siteUrl}/articles/${post.slug}</guid>
      <title>${escape(post.title)}</title>
      <link>${siteMetadata.siteUrl}/articles/${post.slug}</link>
      ${post.summary && `<description>${escape(post.summary)}</description>`}
      <pubDate>${
        post.date && post.date !== null
          ? new Date(post.date).toUTCString()
          : new Date().toUTCString()
      }</pubDate>
      <author>${siteMetadata.email} (${siteMetadata.author})</author>
      ${
        post.authors
          ? post.authors
              .map(
                (a: string) => `
        <io:author>
          <name>${authors[a]?.name || ''}</name>
          <avatar>${authors[a]?.avatar || ''}</avatar>
        </io:author>
      `
              )
              .join('')
          : ''
      }
      ${post.images ? post.images.map((i) => `<image>${i}</image>`).join('') : ''}
      ${post.tags ? post.tags.map((t) => `<category>${t}</category>`).join('') : ''}
    </item>
  `

const generateRss = async (posts: FrontMatter[], page = 'feed.xml'): Promise<string> => {
  const authors = await getAuthors(posts)
  return `
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:io="https://www.iodigital.com">
      <channel>
        <title>${escape(siteMetadata.title)}</title>
        <link>${siteMetadata.siteUrl}/blog</link>
        <description>${escape(siteMetadata.description)}</description>
        <language>${siteMetadata.language}</language>
        <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
        <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
        <lastBuildDate>${
          posts[0]?.date ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()
        }</lastBuildDate>
        <atom:link href="${siteMetadata.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
        ${posts.map((element) => generateRssItem(element, authors)).join('')}
      </channel>
    </rss>
  `
}
export default generateRss
