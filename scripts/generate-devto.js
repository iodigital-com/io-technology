const fs = require('fs')
const path = require('path')
const rss = require('rss')
const globby = require('globby')
const matter = require('gray-matter')
const sanitizeHtml = require('sanitize-html')
const MarkdownIt = require('markdown-it')
const removeMarkdown = require('markdown-to-text').default

const siteMetadata = require('../data/siteMetadata')
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
  blogFiles.slice(0, 5).forEach((file) => {
    const source = fs.readFileSync(file, 'utf8')
    const fm = matter(source)

    if (fm.data.draft || fm.data.canonicalUrl || fm.data.hideInArticleList) {
      return
    }

    // const content = sanitizeHtml(markdownParser.render(fm.content))
    let content = fm.content.replaceAll('/articles/', `${siteMetadata.siteUrl}/articles/`)
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
