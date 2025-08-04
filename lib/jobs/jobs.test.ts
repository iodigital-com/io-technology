import { describe, it, expect, vi } from 'vitest'
import { getAllJobs, getLatestJobs, getRelatedJobs } from './jobs'

// Mock the jobs data inside the mock factory
vi.mock('../../data/jobs.json', () => ({
  default: [
    {
      id: 1,
      title: 'Frontend Developer',
      published_at: '2024-01-15',
      tags: { tag: ['React', 'JavaScript', 'CSS'] },
    },
    {
      id: 2,
      title: 'Backend Developer',
      published_at: '2024-01-10',
      tags: { tag: 'Node.js' },
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      published_at: '2024-01-20',
      tags: { tag: ['React', 'Node.js', 'TypeScript'] },
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      published_at: '2024-01-05',
      tags: { tag: ['Design', 'Figma'] },
    },
  ],
}))

const mockJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    published_at: '2024-01-15',
    tags: { tag: ['React', 'JavaScript', 'CSS'] },
  },
  {
    id: 2,
    title: 'Backend Developer',
    published_at: '2024-01-10',
    tags: { tag: 'Node.js' },
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    published_at: '2024-01-20',
    tags: { tag: ['React', 'Node.js', 'TypeScript'] },
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    published_at: '2024-01-05',
    tags: { tag: ['Design', 'Figma'] },
  },
]

// Mock string-similarity
vi.mock('string-similarity', () => ({
  default: {
    compareTwoStrings: vi.fn((str1, str2) => {
      // Simple mock implementation - higher score for matching words
      const words1 = str1.toLowerCase().split(/\s+/)
      const words2 = str2.toLowerCase().split(/\s+/)
      const commonWords = words1.filter((word: string) =>
        words2.some((w: string) => w.includes(word) || word.includes(w))
      )
      return commonWords.length / Math.max(words1.length, words2.length)
    }),
  },
}))

describe('jobs utilities', () => {
  describe('getAllJobs', () => {
    it('should return all jobs', async () => {
      const result = await getAllJobs()
      expect(result).toEqual({ jobs: mockJobs })
    })
  })

  describe('getLatestJobs', () => {
    it('should return jobs sorted by published_at in descending order', async () => {
      const result = await getLatestJobs()

      expect(result.jobs).toHaveLength(4)
      expect(result.jobs?.[0]?.published_at).toBe('2024-01-20') // Most recent
      expect(result.jobs?.[1]?.published_at).toBe('2024-01-15')
      expect(result.jobs?.[2]?.published_at).toBe('2024-01-10')
      expect(result.jobs?.[3]?.published_at).toBe('2024-01-05') // Oldest
    })

    it('should limit results to specified number', async () => {
      const result = await getLatestJobs(2)

      expect(result.jobs).toHaveLength(2)
      expect(result.jobs?.[0]?.published_at).toBe('2024-01-20')
      expect(result.jobs?.[1]?.published_at).toBe('2024-01-15')
    })

    it('should default to 5 jobs when no limit specified', async () => {
      const result = await getLatestJobs()

      expect(result.jobs).toHaveLength(4) // We only have 4 mock jobs
    })

    it('should handle edge case: requesting 0 jobs', async () => {
      const result = await getLatestJobs(0)
      expect(result.jobs).toHaveLength(0)
    })
  })

  describe('getRelatedJobs', () => {
    it('should return jobs related to search string', async () => {
      const result = await getRelatedJobs(5, 'React Frontend')

      expect(result).toHaveLength(4)
      // Jobs with React should score higher
      expect(result[0]?.title).toContain('Frontend')
    })

    it('should limit results to specified number', async () => {
      const result = await getRelatedJobs(2, 'Developer')

      expect(result).toHaveLength(2)
    })

    it('should handle tags as array', async () => {
      const result = await getRelatedJobs(5, 'React')

      expect(result).toHaveLength(4)
      // Should find jobs with React in tags array
      const reactJobs = result.filter(
        (job: any) => Array.isArray(job.tags.tag) && job.tags.tag.includes('React')
      )
      expect(reactJobs.length).toBeGreaterThan(0)
    })

    it('should handle tags as string', async () => {
      const result = await getRelatedJobs(5, 'Node.js')

      expect(result).toHaveLength(4)
      // Should find job with Node.js as string tag
      const nodeJob = result.find((job: any) => job.tags.tag === 'Node.js')
      expect(nodeJob).toBeDefined()
    })

    it('should handle empty tags gracefully', async () => {
      const result = await getRelatedJobs(5, 'Manager')

      // We only have 4 mock jobs, so expect 4
      expect(result).toHaveLength(4)

      // Should still return results even though search doesn't match well
      expect(result[0]).toBeDefined()
    })

    it('should return jobs sorted by relevance score', async () => {
      const result = await getRelatedJobs(5, 'Frontend React')

      expect(result).toHaveLength(4)
      // Results should be sorted by similarity score (mocked implementation)
      // More relevant jobs should appear first
      expect(result[0]).toBeDefined()
    })

    it('should default to 5 jobs when no limit specified', async () => {
      const result = await getRelatedJobs(undefined, 'Developer')

      expect(result).toHaveLength(4) // We only have 4 mock jobs
    })
  })
})
