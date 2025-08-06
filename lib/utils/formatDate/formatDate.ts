import type { DateInput } from './types'
import { Result } from '../../../types/api'

const formatDate = (date: DateInput, locale: string = 'en-US'): string => {
  // Handle special cases
  if (date === undefined) return 'Invalid Date'
  if (date === '') return 'Invalid Date'
  if (date === null) {
    // Treat null as Unix epoch (timestamp 0)
    date = 0
  }

  // Convert all valid inputs to Date object
  let dateObj: Date
  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (typeof date === 'number') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else {
    return 'Invalid Date'
  }

  // Check for invalid dates
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  try {
    return dateObj.toLocaleDateString(locale, options)
  } catch (error) {
    console.warn('Date formatting error:', error)
    return 'Invalid Date'
  }
}

// Enhanced version that returns a Result type for better error handling
export const formatDateSafe = (
  date: DateInput,
  locale: string = 'en-US'
): Result<string, 'INVALID_DATE' | 'FORMATTING_ERROR'> => {
  if (!date) {
    return { success: false, error: 'INVALID_DATE' }
  }

  // Convert all valid inputs to Date object
  let dateObj: Date
  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (typeof date === 'number') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else {
    return { success: false, error: 'INVALID_DATE' }
  }

  if (isNaN(dateObj.getTime())) {
    return { success: false, error: 'INVALID_DATE' }
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  try {
    const formatted = dateObj.toLocaleDateString(locale, options)
    return { success: true, data: formatted }
  } catch (error) {
    return { success: false, error: 'FORMATTING_ERROR' }
  }
}

export default formatDate
