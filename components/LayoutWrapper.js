import { useEffect, useRef, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'

const LayoutWrapper = ({ children }) => {
  const [scrolledPassedHeader, setScrolledPassedHeader] = useState(false)
  const headerRef = useRef()
  useEffect(() => {
    const headerHeight = headerRef.current.scrollHeight
    const handleScroll = () => {
      setScrolledPassedHeader(window.scrollY >= headerHeight)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50  ${
          scrolledPassedHeader ? '' : 'bg-io_blue-500'
        } py-4 px-4 text-white sm:bg-io_blue-500`}
      >
        <div className="container mx-auto flex items-center justify-between sm:justify-start">
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center justify-between">
                <div
                  className={`mr-3 ${
                    scrolledPassedHeader ? 'opacity-0' : 'opacity-100'
                  } duration-150 ease-out sm:opacity-100`}
                >
                  <Logo />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="hidden h-6 items-center text-xl font-semibold sm:flex xl:text-2xl">
                    {siteMetadata.headerTitle}
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden items-center sm:flex">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="font-medium text-white dark:text-gray-100 sm:mt-2 sm:p-4"
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
