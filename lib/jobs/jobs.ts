import type { Job } from './types'
import jobs from '@/data/jobs.json'
import stringSimilarity from 'string-similarity'

export async function getAllJobs() {
  return { jobs }
}

export async function getJobs(): Promise<Job[]> {
  const { jobs } = await getAllJobs()
  const jobsArray = Array.isArray(jobs) ? jobs : []
  return jobsArray
    .sort(
      (a: Job, b: Job) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    )
    .slice(0, 5)
}

export async function getLatestJobs(num: number = 5): Promise<{ jobs: Job[] }> {
  const jobs = await getJobs()
  return { jobs: jobs.slice(0, num) }
}

export async function getRelatedJobs(num: number = 5, searchString?: string): Promise<Job[]> {
  if (!searchString) {
    return getJobs().then((jobs) => jobs.slice(0, num))
  }

  const { jobs } = await getAllJobs()
  // Ensure jobs is an array before processing
  const jobsArray = Array.isArray(jobs) ? jobs : []

  const jobResults = jobsArray.map((job) => {
    const tagString = job.tags?.tag instanceof Array ? job.tags.tag.join(' ') : job.tags?.tag || ''
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
