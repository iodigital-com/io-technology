import Link from './Link'
import Arrow from '@/data/arrow.svg'

export default function Pagination({ totalPages, currentPage, subpath = 'articles' }) {
  const prevPage = parseInt(currentPage) - 1 > 0
  const nextPage = parseInt(currentPage) + 1 <= parseInt(totalPages)
  const btnClasses =
    'group relative inline-flex rounded-full bg-io_blue-600 px-9 py-4 text-base font-bold leading-none text-white transition-all delay-100'
  const btnClassesDisabled =
    'group relative inline-flex rounded-full bg-gray-300 px-9 py-4 text-base font-bold leading-none text-white transition-all delay-100 cursor-not-allowed'

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button rel="previous" className={btnClassesDisabled} disabled={!prevPage}>
            <Arrow className="mr-3 w-5 rotate-180 transition-transform group-hover:-translate-x-3" />
            <span>Previous</span>
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${subpath}/` : `/${subpath}/page/${currentPage - 1}`}
            rel="previous"
            className={btnClasses}
          >
            <Arrow className="mr-3 w-5 rotate-180 transition-transform group-hover:-translate-x-3" />
            <span>Previous</span>
          </Link>
        )}
        <span className="py-4 text-base font-bold leading-none">
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button rel="next" className={btnClassesDisabled} disabled={!nextPage}>
            <span>Next</span>
            <Arrow className="ml-3 w-5 transition-transform group-hover:translate-x-3" />
          </button>
        )}
        {nextPage && (
          <Link href={`/${subpath}/page/${currentPage + 1}`} rel="next" className={btnClasses}>
            <span>Next</span>
            <Arrow className="ml-3 w-5 transition-transform group-hover:translate-x-3" />
          </Link>
        )}
      </nav>
    </div>
  )
}
