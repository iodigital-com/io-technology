import jobs from '@/data/jobs.json'
import stringSimilarity from 'string-similarity'

export async function getAllJobs() {
  return jobs
}

export async function getLatestJobs(num = 5) {
  const { jobs } = await getAllJobs()
  return {
    jobs: jobs.sort((a, b) => new Date(b.published_at) - new Date(a.published_at)).slice(0, num),
  }
}

export async function getRelatedJobs(num = 5, searchString) {
  const { jobs } = await getAllJobs()

  const jobResults = jobs.map((job) => {
    const tagString = job.tags.tag instanceof Array ? job.tags.tag.join(' ') : job.tags.tag || ''
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

  return {
    jobs: bestMatches,
  }
}
