import jobs from '@/data/jobs.json'

export async function getAllJobs() {
  return jobs
}

export async function getLatestJobs(num = 5) {
  const { jobs } = await getAllJobs()
  return {
    jobs: jobs.sort((a, b) => new Date(b.published_at) - new Date(a.published_at)).slice(0, num),
  }
}
