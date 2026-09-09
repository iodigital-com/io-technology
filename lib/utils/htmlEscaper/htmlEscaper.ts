import type { EscapeFunction, EscapeMap } from './types'

const esca: EscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}

const pe = (m: keyof EscapeMap): string => esca[m] || ''

// Create a regex for all keys in esca
const ca = /[&<>"']/g

// regexs and replacer for custom escaping like what we have here.
const replace = (text: string, regex: RegExp, replacer: (match: string) => string): string => {
  return text.replace(regex, replacer)
}

export const escape: EscapeFunction = (input: string | null | undefined): string => {
  if (!input) return ''
  return replace(input, ca, pe)
}
