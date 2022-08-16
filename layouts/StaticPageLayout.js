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
      <article className="container mx-auto mx-auto mb-72 pt-8 pb-14 xl:pt-32">
        <div>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0 "
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <h1 className="heading-title  mb-8 text-center text-4xl font-medium xl:mb-24 xl:text-7xl">
              {<MarkdownRenderer markdown={title} />}
            </h1>
            <div className="mx-auto max-w-xl divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">{children}</div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
