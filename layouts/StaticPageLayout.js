import MarkdownRenderer from 'react-markdown-renderer'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/lib/utils/formatDate'
import ScrollTop from '@/components/ScrollTop'

export default function StaticPageLayout({ frontMatter, authorDetails, next, prev, children }) {
  const { date, title, name } = frontMatter

  return (
    <>
      <PageSEO {...frontMatter} />
      <ScrollTop />
      <article className="container mx-auto mb-72 max-w-xl pb-14 pt-10">
        <div>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0 "
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <h1 className="heading-title text-4xl font-medium xl:text-7xl">
              {<MarkdownRenderer markdown={title} />}
            </h1>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">{children}</div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
