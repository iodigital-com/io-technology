import { describe, it, expect, vi } from 'vitest'
import formatDate from './formatDate'

// Mock siteMetadata
vi.mock('../../../data/siteMetadata', () => ({
  default: {
    locale: 'en-US',
  },
}))

describe('formatDate', () => {
  it('should format a date string correctly', () => {
    const result = formatDate('2024-01-15')
    expect(result).toBe('January 15, 2024')
  })

  it('should format a Date object correctly', () => {
    const date = new Date('2024-01-15')
    const result = formatDate(date)
    expect(result).toBe('January 15, 2024')
  })

  it('should handle different date formats', () => {
    const result = formatDate('2024-12-25')
    expect(result).toBe('December 25, 2024')
  })

  it('should handle ISO date strings', () => {
    const result = formatDate('2024-06-01T10:30:00Z')
    expect(result).toBe('June 1, 2024')
  })

  it('should handle date with time', () => {
    const result = formatDate('2024-03-15 14:30:00')
    expect(result).toBe('March 15, 2024')
  })

  it('should handle single digit dates', () => {
    const result = formatDate('2024-01-05')
    expect(result).toBe('January 5, 2024')
  })

  it('should format current year correctly', () => {
    const currentYear = new Date().getFullYear()
    const result = formatDate(`${currentYear}-07-04`)
    expect(result).toBe(`July 4, ${currentYear}`)
  })

  // New error handling tests
  it('should handle invalid date strings', () => {
    const result = formatDate('invalid-date')
    expect(result).toBe('Invalid Date')
  })

  it('should handle null input', () => {
    const result = formatDate(null)
    expect(result).toBe('January 1, 1970')
  })

  it('should handle undefined input', () => {
    const result = formatDate(undefined)
    expect(result).toBe('Invalid Date')
  })

  it('should handle empty string', () => {
    const result = formatDate('')
    expect(result).toBe('Invalid Date')
  })
})
