import { ReactNode } from 'react'
import { PageSEO } from '@/components/SEO'
import ScrollTop from '@/components/ScrollTop'
import type { FrontMatter } from '../types'
import HeroSection from '@/components/HeroSection'

interface StaticPageLayoutProps {
  frontMatter: FrontMatter
  children: ReactNode
  transparentHeader: boolean
}

export default function StaticPageLayout({
  frontMatter,
  children,
  transparentHeader,
}: StaticPageLayoutProps) {
  const { title, summary } = frontMatter
  const heroTitle = frontMatter.heroTitle as string | undefined
  const heroDescription = frontMatter.heroDescription as string | undefined

  return (
    <>
      <PageSEO title={title} description={summary} />
      <ScrollTop />

      <HeroSection
        title={heroTitle || title}
        description={heroDescription || ''}
        isDarkBackground={transparentHeader}
      />

      <article className="container mx-auto mx-auto mb-72 pb-14 pt-8 xl:pt-18">
        <div>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0 "
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div className="mx-auto max-w-xl divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-dark">{children}</div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
