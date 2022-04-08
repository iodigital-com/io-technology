import { useEffect, useRef, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import Footer from './Footer'
import MobileNav from './MobileNav'
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

  console.log(scrolledPassedHeader)
  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 duration-150 ease-out ${
          scrolledPassedHeader ? '' : `bg-io_${theme}-500`
        } py-4 px-4 text-white xl:bg-io_${theme}-500`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div
                className={`flex items-center justify-between ${
                  scrolledPassedHeader ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="mr-3 duration-150 ease-out sm:opacity-100">
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
          <div className="relative flex items-center text-base leading-5" ref={navigationItemsRef}>
            <div
              className={`hidden items-center rounded-full pl-2 sm:flex ${
                navigationIsOpen ? 'border-white' : 'border-gray-200'
              }`}
            >
              {headerNavLinks.map((link, index) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`font-semibold ease-out sm:mt-2 sm:p-4 ${
                    navigationIsOpen
                      ? 'translate-y-0 text-gray-600 transition-all duration-300 dark:text-white'
                      : `text-white duration-200 dark:text-gray-100
                      ${
                        scrolledPassedHeader
                          ? 'pointer-events-none -translate-y-4 opacity-0'
                          : 'translate-y-0 opacity-100'
                      }`
                  }`}
                  style={{ transitionDelay: `${navigationIsOpen ? 200 + index * 100 : 0}ms` }}
                >
                  {link.title}
                </Link>
              ))}
              <button
                type="button"
                className={`absolute -right-1 -top-1 bottom-0 m-1 h-16 w-16 rounded-full  bg-white p-5 ${
                  scrolledPassedHeader ? 'sm:opacity-100' : 'pointer-events-none opacity-0'
                }
                duration-150 ease-out`}
                aria-label="Toggle Menu"
                onClick={() => setNavigationIsOpen(!navigationIsOpen)}
                style={{ transform: 'scale(0.9)' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 504 291.2"
                  fill="black"
                  className="text-white dark:text-black"
                >
                  <g>
                    <path d="M492.8 156.8H11.2a11.2 11.2 0 1 1 0-22.4h481.6a11.2 11.2 0 0 1 0 22.4ZM504 11.2A11.23 11.23 0 0 0 492.8 0H11.2a11.2 11.2 0 0 0 0 22.4h481.6A11.23 11.23 0 0 0 504 11.2Zm0 268.8a11.23 11.23 0 0 0-11.2-11.2H11.2a11.2 11.2 0 0 0 0 22.4h481.6A11.23 11.23 0 0 0 504 280Z" />
                  </g>
                </svg>
              </button>
              <span
                className={`absolute top-0 right-0 bottom-0 -z-10 h-16 w-full rounded-full border border-gray-200 bg-white transition-all duration-300 ease-out ${
                  navigationIsOpen ? `max-w-2xl` : 'max-w-[calc(72px)]'
                }
                ${scrolledPassedHeader ? 'sm:opacity-100' : 'opacity-0'}`}
              />
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
