// ===========================
// DATE FORMATTING TYPES
// ===========================

// Date input types with better validation
export type DateInput = string | Date | number | null | undefined

// Date format styles
export type DateStyle = 'full' | 'long' | 'medium' | 'short'
export type TimeStyle = 'full' | 'long' | 'medium' | 'short'

// Enhanced date format options
export interface DateFormatOptions {
  // Basic formatting
  year?: 'numeric' | '2-digit'
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow'
  day?: 'numeric' | '2-digit'

  // Time formatting
  hour?: 'numeric' | '2-digit'
  minute?: 'numeric' | '2-digit'
  second?: 'numeric' | '2-digit'
  timeZoneName?: 'short' | 'long'

  // Locale and timezone
  locale?: string
  timeZone?: string

  // Style presets
  dateStyle?: DateStyle
  timeStyle?: TimeStyle

  // Custom formatting
  weekday?: 'long' | 'short' | 'narrow'
  era?: 'long' | 'short' | 'narrow'
  hour12?: boolean
}

// Date range formatting
export interface DateRange {
  start: DateInput
  end: DateInput
}

export interface DateRangeFormatOptions extends DateFormatOptions {
  separator?: string
  sameMonthFormat?: 'compact' | 'full'
  sameYearFormat?: 'compact' | 'full'
}

// Relative time formatting
export type RelativeTimeUnit =
  | 'year'
  | 'years'
  | 'month'
  | 'months'
  | 'week'
  | 'weeks'
  | 'day'
  | 'days'
  | 'hour'
  | 'hours'
  | 'minute'
  | 'minutes'
  | 'second'
  | 'seconds'

export interface RelativeTimeOptions {
  locale?: string
  numeric?: 'always' | 'auto'
  style?: 'long' | 'short' | 'narrow'
}

// Format result types
export interface FormatDateResult {
  formatted: string
  isValid: boolean
  originalInput: DateInput
  parsedDate?: Date
  error?: string
}

// Calendar and scheduling types
export interface CalendarDate {
  year: number
  month: number
  day: number
}

export interface TimeOfDay {
  hour: number
  minute: number
  second?: number
  millisecond?: number
}
