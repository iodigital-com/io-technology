export async function getAllJobs() {
  return fetch('http://localhost:3000/api/jobs').then((res) => res.json())
}

export async function getLatestJobs(num = 5) {
  const { jobs } = await getAllJobs()
  return {
    jobs: jobs.sort((a, b) => new Date(b.published_at) - new Date(a.published_at)).slice(0, num),
  }
}
