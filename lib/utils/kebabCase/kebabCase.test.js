import { describe, it, expect } from 'vitest'
import kebabCase from './kebabCase'

describe('kebabCase', () => {
  it('should convert camelCase to lowercase', () => {
    expect(kebabCase('camelCase')).toBe('camelcase')
  })

  it('should convert PascalCase to lowercase', () => {
    expect(kebabCase('PascalCase')).toBe('pascalcase')
  })

  it('should handle multiple capital letters', () => {
    expect(kebabCase('HTMLParser')).toBe('htmlparser')
  })

  it('should handle strings with spaces', () => {
    expect(kebabCase('hello world')).toBe('hello-world')
  })

  it('should handle strings that are already kebab-case', () => {
    expect(kebabCase('already-kebab-case')).toBe('already-kebab-case')
  })

  it('should handle single words', () => {
    expect(kebabCase('word')).toBe('word')
  })

  it('should handle acronyms by converting to lowercase', () => {
    expect(kebabCase('XMLHttpRequest')).toBe('xmlhttprequest')
  })

  it('should handle mixed cases with numbers', () => {
    expect(kebabCase('HTML5Parser')).toBe('html5parser')
  })

  // New error handling tests
  it('should handle empty string', () => {
    expect(kebabCase('')).toBe('')
  })

  it('should handle null input', () => {
    expect(() => kebabCase(null)).not.toThrow()
    // Depending on implementation, might return empty string or throw
  })

  it('should handle undefined input', () => {
    expect(() => kebabCase(undefined)).not.toThrow()
  })

  it('should handle numbers', () => {
    expect(() => kebabCase(123)).not.toThrow()
  })

  it('should handle special characters by removing them', () => {
    expect(kebabCase('hello@world.com')).toBe('helloworldcom')
  })

  it('should handle underscores', () => {
    expect(kebabCase('snake_case')).toBe('snake_case')
  })
})
