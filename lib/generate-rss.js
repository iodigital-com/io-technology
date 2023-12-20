import { escape } from '@/lib/utils/htmlEscaper'
import { getAuthors } from '@/lib/authors'

import siteMetadata from '@/data/siteMetadata'

const generateRssItem = (post, authors) => `
    <item>
      <guid>${siteMetadata.siteUrl}/articles/${post.slug}</guid>
      <title>${escape(post.title)}</title>
      <link>${siteMetadata.siteUrl}/articles/${post.slug}</link>
      ${post.summary && `<description>${escape(post.summary)}</description>`}
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${siteMetadata.email} (${siteMetadata.author})</author>
      ${
        post.authors
          ? post.authors
              .map(
                (a) => `
        <io:author>
          <name>${authors[a].name}</name>
          <avatar>${authors[a].avatar}</avatar>
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

const generateRss = async (posts, page = 'feed.xml') => {
  const authors = await getAuthors(posts)
  return `
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escape(siteMetadata.title)}</title>
        <link>${siteMetadata.siteUrl}/blog</link>
        <description>${escape(siteMetadata.description)}</description>
        <language>${siteMetadata.language}</language>
        <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
        <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
        <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
        <atom:link href="${siteMetadata.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
        ${posts.map((element) => generateRssItem(element, authors)).join('')}
      </channel>
    </rss>
  `
}
export default generateRss
