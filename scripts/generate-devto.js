import fs from 'fs'
import path from 'path'
import rss from 'rss'
import globby from 'globby'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { default as removeMarkdown } from 'markdown-to-text'
import siteMetadata from '../data/siteMetadata.js'

const distPath = 'public/devto.xml'

const markdownParser = new MarkdownIt()

;(async () => {
  let feed = new rss({
    title: siteMetadata.title,
    feed_url: [siteMetadata.siteUrl, distPath].join('/'),
    site_url: siteMetadata.siteUrl,
    language: siteMetadata.language,
    managingEditor: `${siteMetadata.email} (${siteMetadata.author})`,
    webMaster: `${siteMetadata.email} (${siteMetadata.author})`,
    generator: siteMetadata.title,
  })

  const blogFiles = await globby(['data/blog/**/*.mdx', 'data/blog/**/*.md'])
  blogFiles.forEach((file) => {
    const source = fs.readFileSync(file, 'utf8')
    const fm = matter(source)

    if (fm.data.draft || fm.data.canonicalUrl || fm.data.hideInArticleList) {
      return
    }

    let content = fm.content.replaceAll('/articles/', `${siteMetadata.siteUrl}/articles/`)
    content = markdownParser.render(content)

    const slug = file.replace('data/blog', '/articles').replace(/\.(mdx|md)/, '')

    feed.item({
      title: removeMarkdown(fm.data.title),
      description: fm.data.summary,
      url: siteMetadata.siteUrl + slug,
      guid: siteMetadata.siteUrl + slug,
      categories: fm.data.tags,
      date: new Date(fm.data.date).toUTCString(),
      custom_elements: [{ 'content:encoded': content }],
    })
  })

  const xml = feed.xml({ indent: true })
  fs.writeFileSync(path.resolve(distPath), xml)
})()
