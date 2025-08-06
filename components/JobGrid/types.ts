import type { Job } from '../../lib/jobs/types'

// ===========================
// JOB GRID TYPES
// ===========================

// Job display options
export interface JobDisplayOptions {
  showCompany?: boolean
  showLocation?: boolean
  showSalary?: boolean
  showType?: boolean
  showTags?: boolean
  maxJobs?: number
  compactView?: boolean
}

// Job filtering options
export interface JobFilters {
  location?: string
  type?: string[]
  company?: string[]
  skills?: string[]
  remote?: boolean
}

// Enhanced JobGrid props
export interface JobGridProps {
  jobs: Job[]
  displayOptions?: JobDisplayOptions
  filters?: JobFilters
  onJobClick?: (job: Job) => void
  onJobApply?: (job: Job) => void
  loading?: boolean
  error?: string
  className?: string
  emptyStateMessage?: string
}

// Individual job card props
export interface JobCardProps {
  job: Job
  compact?: boolean
  showCompany?: boolean
  showLocation?: boolean
  showSalary?: boolean
  showType?: boolean
  showTags?: boolean
  onClick?: (job: Job) => void
  onApply?: (job: Job) => void
}
