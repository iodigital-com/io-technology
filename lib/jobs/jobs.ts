// import type { Job } from './types' // TODO: Fix type mismatch with actual job data
import jobs from '@/data/jobs.json'
import stringSimilarity from 'string-similarity'

export async function getAllJobs() {
  return { jobs: jobs.jobs }
}

export async function getJobs(): Promise<any[]> {
  const { jobs } = await getAllJobs()
  const jobsArray = Array.isArray(jobs) ? jobs : []
  return jobsArray
    .filter((job: any) => !job.closed || job.closed === '') // Filter out closed jobs
    .sort((a: any, b: any) => {
      // Primary sort by published_at
      const dateComparison = new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      // If dates are the same, sort by job ID (higher ID = more recent)
      return dateComparison !== 0 ? dateComparison : parseInt(b.id) - parseInt(a.id)
    })
}

export async function getLatestJobs(num: number = 5): Promise<{ jobs: any[] }> {
  const jobs = await getJobs()
  return { jobs: jobs.slice(0, num) }
}

export async function getRelatedJobs(num: number = 5, searchString?: string): Promise<any[]> {
  if (!searchString) {
    return getJobs().then((jobs) => jobs.slice(0, num))
  }

  const { jobs } = await getAllJobs()
  // Ensure jobs is an array before processing
  const jobsArray = Array.isArray(jobs) ? jobs : []

  const jobResults = jobsArray.map((job: any) => {
    // Handle tags field safely - it can be a string or an object with tag property
    let tagString = ''
    if (job.tags) {
      if (typeof job.tags === 'string') {
        tagString = job.tags
      } else if (job.tags.tag) {
        tagString = Array.isArray(job.tags.tag) ? job.tags.tag.join(' ') : job.tags.tag
      }
    }
    const titleAndTags = `${job.title} || ${tagString}`

    const result = stringSimilarity.compareTwoStrings(searchString, titleAndTags)

    return {
      job,
      score: result,
    }
  })

  const bestMatches = jobResults
    .sort((a, b) => b.score - a.score)
    .map((a) => a.job)
    .slice(0, num)

  return bestMatches
}
