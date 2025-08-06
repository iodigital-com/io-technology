import { ReactNode } from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import { PageSEO } from '@/components/SEO'
import ScrollTop from '@/components/ScrollTop'
import Image from '@/components/Image'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import type { FrontMatter } from '../types'

interface StaticPageLayoutProps {
  frontMatter: FrontMatter
  children: ReactNode
}

export default function StaticPageLayout({ frontMatter, children }: StaticPageLayoutProps) {
  const { title, summary, theme } = frontMatter
  const heroImage = frontMatter.heroImage as string | undefined
  const heroImageAlt = frontMatter.heroImageAlt as string | undefined
  const heroTitle = frontMatter.heroTitle as string | undefined
  const heroDescription = frontMatter.heroDescription as string | undefined
  const { theme: currentTheme } = useBrandingTheme()
  const pageTheme = theme || currentTheme

  return (
    <>
      <PageSEO title={title} description={summary} />
      <ScrollTop />

      {/* Hero Section */}
      {heroImage && (
        <section className={`bg-io_${pageTheme}-500`}>
          <div className="container mx-auto pb-24 pt-8 md:pb-32">
            <div className="grid grid-cols-12">
              <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mb-10 md:mt-4 xl:row-start-1 xl:mb-16 xl:mt-12">
                <h1 className="text-4xl md:text-5xl xl:text-7xl">{heroTitle || title}</h1>
              </div>
              <div className="col-start-1 col-end-12 mb-8 md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-4 md:mb-0 xl:col-start-9 xl:row-start-1">
                <Image
                  src={heroImage}
                  width={1192}
                  height={1192}
                  className="aspect-square h-auto w-full rounded-full object-cover"
                  alt={heroImageAlt || ''}
                />
              </div>
              {heroDescription && (
                <div className="col-span-full md:col-span-5 md:col-start-3 xl:col-span-4 xl:col-start-3">
                  <div className="xl:w-11/12">
                    <p className="mb-4">{heroDescription}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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
