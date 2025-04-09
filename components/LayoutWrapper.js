'use client'

import { useEffect, useRef, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import Footer from './Footer'
import MobileNav from './MobileNav'
import { Player } from './LottiePlayer'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

const LayoutWrapper = ({ children }) => {
  const [navigationIsOpen, setNavigationIsOpen] = useState(false)
  const [scrolledPassedHeader, setScrolledPassedHeader] = useState(false)
  const headerRef = useRef()
  const navigationItemsRef = useRef()

  useEffect(() => {
    const headerHeight = headerRef.current.scrollHeight
    const handleScroll = () => {
      const hasScrolledPasHeader = window.scrollY >= headerHeight

      setScrolledPassedHeader(hasScrolledPasHeader)

      if (!hasScrolledPasHeader) {
        setNavigationIsOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  const { theme } = useBrandingTheme()
  const themeBg = theme === 'default' ? 'white' : theme

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 duration-150 ease-out ${
          scrolledPassedHeader ? 'bg-white shadow-md' : `bg-io_${themeBg}-500`
        } px-4 py-4`}
      >
        <div className="container mx-auto flex items-center justify-between p-0">
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div
                className={`flex items-center justify-between ${
                  scrolledPassedHeader ? 'opacity-100' : 'pointer-events-auto opacity-100'
                }`}
              >
                <div className="mr-3 duration-150 ease-out sm:opacity-100">
                  <Player
                    autoplay
                    src="/logo.json"
                    className={`logo -translate-x-3 sm:translate-x-0`}
                  />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="hidden h-6 items-center font-mono text-xl font-light sm:flex xl:text-2xl">
                    {siteMetadata.headerTitle}
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
          </div>
          <div
            className={`relative flex items-center text-base leading-5`}
            ref={navigationItemsRef}
          >
            <div
              className={`hidden items-center rounded-full pl-2 sm:flex sm:pr-12 ${
                navigationIsOpen ? 'pointer-events-auto border-white' : 'border-gray-200'
              }`}
            >
              {headerNavLinks.map((link, index) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`font-semibold ease-out sm:mt-2 sm:p-4 ${
                    navigationIsOpen
                      ? 'translate-y-0 text-gray-600 transition-all duration-300 dark:text-white'
                      : `duration-200 ${
                          scrolledPassedHeader ? 'text-gray-600' : 'dark:text-gray-100'
                        }`
                  }`}
                  style={{ transitionDelay: `${navigationIsOpen ? 200 + index * 100 : 0}ms` }}
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <MobileNav />
          </div>
        </div>
      </header>
      <div className="flex h-full flex-col justify-between">
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </>
  )
}

export default LayoutWrapper
