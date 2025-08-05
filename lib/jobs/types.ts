// ===========================
// JOB TYPES
// ===========================

// Employment types
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'

// Experience levels
export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'principal'

// Job location types
export type LocationType = 'remote' | 'on-site' | 'hybrid'

// Salary information
export interface SalaryInfo {
  min?: number
  max?: number
  currency?: string
  period?: 'hourly' | 'daily' | 'monthly' | 'yearly'
  negotiable?: boolean
}

// Company information
export interface CompanyInfo {
  name: string
  logo?: string
  website?: string
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  industry?: string
  description?: string
}

// Job location
export interface JobLocation {
  city?: string
  state?: string
  country?: string
  timezone?: string
  type: LocationType
}

// Enhanced Job interface
export interface Job {
  id: string
  title: string
  company?: CompanyInfo | string // Support both structured and string
  location?: JobLocation | string // Support both structured and string
  country?: string
  city?: string
  postal_code?: string
  country_code?: string
  department?: string
  employment_type?: string
  category?: string
  experience?: string
  education?: string
  type?: EmploymentType
  experienceLevel?: ExperienceLevel
  published_at: string
  created_at?: string
  updated_at?: string
  description?: string
  requirements?: string[]
  responsibilities?: string[]
  benefits?: string[]
  url?: string
  applyUrl?: string
  careers_url?: string
  salary?: SalaryInfo
  skills?: string[]
  tags?: {
    tag: string | string[]
    [key: string]: unknown
  }
  min_hours?: number | null
  max_hours?: number | null
  remote?: boolean
  urgent?: boolean
  featured?: boolean
  expiresAt?: string
  closed?: string
}

// Job search and filtering
export interface JobSearchOptions {
  searchString?: string
  limit?: number
  location?: string
  type?: EmploymentType[]
  experienceLevel?: ExperienceLevel[]
  remote?: boolean
  salary?: {
    min?: number
    max?: number
  }
  skills?: string[]
}

// Job API response
export interface JobsResponse {
  jobs: Job[]
  total: number
  page?: number
  limit?: number
  hasMore?: boolean
}

// Job application data
export interface JobApplication {
  jobId: string
  applicantName: string
  applicantEmail: string
  resume?: File | string
  coverLetter?: string
  customFields?: Record<string, unknown>
}
