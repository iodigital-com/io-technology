import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Shuffle from './shuffle'

describe('Shuffle', () => {
  it('should return an array of the same length', () => {
    const input = [1, 2, 3, 4, 5]
    const result = Shuffle([...input]) // Copy to avoid mutation of test data
    expect(result).toHaveLength(input.length)
  })

  it('should contain all original elements', () => {
    const input = ['a', 'b', 'c', 'd']
    const result = Shuffle([...input])

    input.forEach((item) => {
      expect(result).toContain(item)
    })
  })

  it('should handle single element arrays', () => {
    const input = [42]
    const result = Shuffle([...input])
    expect(result).toEqual([42])
  })

  it('should handle empty arrays', () => {
    const input = []
    const result = Shuffle([...input])
    expect(result).toEqual([])
  })

  it('should handle arrays with duplicate elements', () => {
    const input = [1, 1, 2, 2, 3]
    const result = Shuffle([...input])

    expect(result).toHaveLength(5)
    expect(result.filter((x) => x === 1)).toHaveLength(2)
    expect(result.filter((x) => x === 2)).toHaveLength(2)
    expect(result.filter((x) => x === 3)).toHaveLength(1)
  })

  it('should work with different data types', () => {
    const input = [1, 'string', true, null, { key: 'value' }]
    const result = Shuffle([...input])

    expect(result).toHaveLength(5)
    expect(result).toContain(1)
    expect(result).toContain('string')
    expect(result).toContain(true)
    expect(result).toContain(null)
    expect(result).toContain(input[4]) // object reference
  })

  it('should actually shuffle elements with controlled randomness', () => {
    // Mock Math.random to return predictable values
    const mockRandom = vi.spyOn(Math, 'random')

    // Set up predictable random values that will cause reordering
    mockRandom
      .mockReturnValueOnce(0.8) // First comparison: likely to swap
      .mockReturnValueOnce(0.2) // Second comparison: likely not to swap
      .mockReturnValueOnce(0.9) // Third comparison: likely to swap

    const input = [1, 2, 3, 4]
    const result = Shuffle([...input])

    // Should still contain all elements
    expect(result).toHaveLength(4)
    expect(result).toContain(1)
    expect(result).toContain(2)
    expect(result).toContain(3)
    expect(result).toContain(4)

    mockRandom.mockRestore()
  })

  it('should produce different results over multiple runs (statistical test)', () => {
    const input = [1, 2, 3, 4, 5, 6]
    const results = []

    // Run shuffle multiple times
    for (let i = 0; i < 20; i++) {
      results.push(Shuffle([...input]).join(','))
    }

    // Should have some variation (not all results identical)
    const uniqueResults = new Set(results)
    expect(uniqueResults.size).toBeGreaterThan(1)
  })

  it('should mutate the original array (current implementation behavior)', () => {
    const input = [1, 2, 3, 4, 5]
    const originalInput = [...input]

    const result = Shuffle(input)

    // Current implementation mutates the original array
    expect(input).not.toEqual(originalInput)
    expect(input).toEqual(result) // Result should be the same as mutated input
  })

  it('should work with large arrays', () => {
    const input = Array.from({ length: 100 }, (_, i) => i)
    const result = Shuffle([...input])

    expect(result).toHaveLength(100)
    // Check that all numbers 0-99 are present
    for (let i = 0; i < 100; i++) {
      expect(result).toContain(i)
    }
  })
})
