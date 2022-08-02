import { useEffect, useRef, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import Footer from './Footer'
import MobileNav from './MobileNav'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import { Player } from '@lottiefiles/react-lottie-player'

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
  const textClass = theme === 'default' ? 'text-black' : 'text-white'

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 duration-150 ease-out ${
          scrolledPassedHeader ? 'pointer-events-none' : `bg-io_${themeBg}-500`
        } py-4 px-4 ${textClass} xl:bg-io_${themeBg}-500`}
      >
        <div className="container mx-auto flex items-center justify-between p-0">
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div
                className={`flex items-center justify-between ${
                  scrolledPassedHeader ? 'opacity-0' : 'pointer-events-auto opacity-100'
                }`}
              >
                <div className="mr-3 duration-150 ease-out sm:opacity-100">
                  <Player
                    autoplay
                    src="/logo.json"
                    className={`logo theme-${theme} -translate-x-3 sm:translate-x-0`}
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
          <div className="relative flex items-center text-base leading-5" ref={navigationItemsRef}>
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
                      : `${textClass} duration-200 dark:text-gray-100
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
                className={`pointer-events-auto absolute -right-1 -top-1 bottom-0 m-1 h-16 w-16 rounded-full  bg-white p-5 ${
                  scrolledPassedHeader ? 'sm:opacity-100' : 'pointer-events-none opacity-0'
                }
                duration-150 ease-out`}
                aria-label="Toggle Menu"
                onClick={() => setNavigationIsOpen(!navigationIsOpen)}
                style={{ transform: 'scale(0.9)' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox={navigationIsOpen ? '0 0 23 23' : '0 0 504 291.2'}
                  fill="black"
                  className="text-white dark:text-black"
                >
                  {navigationIsOpen ? (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="m12.414 11 9.193-9.192L20.192.394 11 9.586 1.808.394.393 1.808 9.586 11 .393 20.192l1.415 1.415L11 12.414l9.192 9.193 1.415-1.415L12.414 11Z"
                      fill="#1F1F1F"
                    />
                  ) : (
                    <path d="M492.8 156.8H11.2a11.2 11.2 0 1 1 0-22.4h481.6a11.2 11.2 0 0 1 0 22.4ZM504 11.2A11.23 11.23 0 0 0 492.8 0H11.2a11.2 11.2 0 0 0 0 22.4h481.6A11.23 11.23 0 0 0 504 11.2Zm0 268.8a11.23 11.23 0 0 0-11.2-11.2H11.2a11.2 11.2 0 0 0 0 22.4h481.6A11.23 11.23 0 0 0 504 280Z" />
                  )}
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
