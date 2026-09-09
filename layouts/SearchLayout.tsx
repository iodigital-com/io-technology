interface SearchLayoutProps {
  onChange: (value: string) => void
  searchPlaceholder: string
}

export default function SearchLayout({ onChange, searchPlaceholder }: SearchLayoutProps) {
  return (
    <div className="col-span-full grid grid-cols-12 md:col-span-6 md:col-start-1 lg:col-span-6 lg:col-start-1 mt-6 lg:mt-12">
      <div className="col-span-full">
        <div className="relative">
          <div className="relative flex justify-between py-4">
            <input
              type="search"
              name="search"
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              className="w-full px-5 py-5"
              onChange={(e) => onChange(e.target.value)}
            />
            <svg
              className="absolute right-3 top-9 h-7 w-7 text-gray-400 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
