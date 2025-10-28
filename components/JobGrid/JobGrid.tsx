import Link from '../Link'
import type { Job } from '../../lib/jobs/types'

interface JobGridProps {
  jobs?: Job[]
}

const JobGrid = ({ jobs = [] }: JobGridProps) => {
  // Ensure jobs is an array
  const jobsArray = Array.isArray(jobs) ? jobs : []

  return (
    <div className="grid gap-4 gap-y-10 xl:grid-cols-5">
      {jobsArray.map((job) => (
        <Link
          key={job.id}
          href={job.careers_url || job.url || '#'}
          target="_blank"
          rel="noreferrer"
          className="h-40 border-t border-slate-200 pt-3"
        >
          <article>
            <header>
              <h3
                className="text my-1.5 text-xl font-medium"
                dangerouslySetInnerHTML={{ __html: job.title }}
              ></h3>
            </header>
            <p className="mb-2 font-serif text-sm font-light">
              {typeof job.location === 'string'
                ? job.location
                : job.location?.city || job.city || job.country || 'Remote'}
            </p>
            <svg style={{ width: 24, height: 24 }} className="text-gray-400" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
              />
            </svg>
          </article>
        </Link>
      ))}
      <Link
        href="https://www.iodigital.com/en/careers/jobs?expertise=Technology"
        target="_blank"
        rel="noreferrer"
        className={`h-40 bg-io_energeticBlue-600 p-2 pt-3 text-white hover:bg-io_energeticBlue-700`}
      >
        <h3 className="text my-1.5 text-2xl font-medium">
          View all <span className="font-serif font-light">jobs</span>
        </h3>
        <svg style={{ width: 24, height: 24 }} className="text-white" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"
          />
        </svg>
      </Link>
    </div>
  )
}

export default JobGrid
