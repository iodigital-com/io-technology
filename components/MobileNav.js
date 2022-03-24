import { useState } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  return (
    <div className="sm:hidden">
      <button
        type="button"
        className="h-16 w-16 rounded-full border border-gray-100 bg-white p-5"
        aria-label="Toggle Menu"
        onClick={onToggleNav}
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
      <div
        className={`fixed top-0 right-0 z-10 flex h-full w-full transform flex-col items-end bg-white pt-10 duration-300 ease-in-out ${
          navShow ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          className="ml-auto mr-4 h-8 w-8 rounded"
          aria-label="Toggle Menu"
          onClick={onToggleNav}
        >
          <svg
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
            fill="black"
            className="text-white dark:text-black"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="m12.414 11 9.193-9.192L20.192.394 11 9.586 1.808.394.393 1.808 9.586 11 .393 20.192l1.415 1.415L11 12.414l9.192 9.193 1.415-1.415L12.414 11Z"
              fill="#1F1F1F"
            ></path>
          </svg>
        </button>
        <nav className="fixed mt-24 h-full w-full">
          {headerNavLinks.map((link) => (
            <div key={link.title} className="flex justify-between px-12 py-4">
              <Link
                href={link.href}
                className="text-3xl font-medium tracking-widest text-black dark:text-gray-100"
                onClick={onToggleNav}
              >
                {link.title}
              </Link>
              <svg
                width="14"
                viewBox="0 0 26 16"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 rotate-45"
              >
                <path
                  d="M17.825.575l-1.237 1.238L21.9 7.125H.75v1.75H21.9l-5.312 5.312 1.237 1.237L25.25 8 17.825.575z"
                  fill="black"
                ></path>
              </svg>
            </div>
          ))}
        </nav>
        <hr />
      </div>
    </div>
  )
}

export default MobileNav
