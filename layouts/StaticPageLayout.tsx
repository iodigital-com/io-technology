import { ReactNode } from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import { PageSEO } from '@/components/SEO'
import ScrollTop from '@/components/ScrollTop'
import type { FrontMatter } from '../types'
import HeroSection from '@/components/HeroSection'

interface StaticPageLayoutProps {
  frontMatter: FrontMatter
  children: ReactNode
}

export default function StaticPageLayout({ frontMatter, children }: StaticPageLayoutProps) {
  const { title, summary } = frontMatter
  const heroImage = frontMatter.heroImage as string | undefined
  const heroTitle = frontMatter.heroTitle as string | undefined
  const heroDescription = frontMatter.heroDescription as string | undefined

  return (
    <>
      <PageSEO title={title} description={summary} />
      <ScrollTop />

      <HeroSection title={heroTitle || title} description={heroDescription || ''} />

      <article className="container mx-auto mx-auto mb-72 pb-14 pt-8 xl:pt-18">
        <div>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0 "
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            {/* Only show page title if no hero section */}
            {!heroImage && (
              <h1 className="heading-title  mb-8 text-center text-4xl font-medium xl:mb-24 xl:text-7xl">
                <MarkdownRenderer markdown={title} />
              </h1>
            )}
            <div className="mx-auto max-w-xl divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-dark">{children}</div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
