import Link from 'next/link'
import Arrow from '@/data/arrow.svg'

export default function Pagination({ totalPages, currentPage, subpath = 'articles' }) {
  const prevPage = parseInt(currentPage) - 1 > 0
  const nextPage = parseInt(currentPage) + 1 <= parseInt(totalPages)
  const btnClasses =
    'relative inline-flex rounded-full border border-black py-4 px-9 text-base font-bold leading-none transition-colors delay-100 hover:bg-black hover:text-white'
  const btnClassesDisabled = `${btnClasses} cursor-auto disabled:opacity-50`

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button rel="previous" className={btnClassesDisabled} disabled={!prevPage}>
            <Arrow className="mr-4 w-6 rotate-180" />
            <span>Previous</span>
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${subpath}/` : `/${subpath}/page/${currentPage - 1}`}
            rel="previous"
            className={btnClasses}
          >
            <Arrow className="mr-4 w-6 rotate-180" />
            <span>Previous</span>
          </Link>
        )}
        <span className="py-4 text-base font-bold leading-none">
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button rel="next" className={btnClassesDisabled} disabled={!nextPage}>
            <span>Next</span>
            <Arrow className="ml-4 w-6" />
          </button>
        )}
        {nextPage && (
          <Link href={`/${subpath}/page/${currentPage + 1}`} rel="next" className={btnClasses}>
            <span>Next</span>
            <Arrow className="ml-4 w-6" />
          </Link>
        )}
      </nav>
    </div>
  )
}
