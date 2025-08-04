import { describe, it, expect } from 'vitest'
import { escape } from './htmlEscaper'

describe('htmlEscaper', () => {
  describe('escape', () => {
    it('should escape ampersand characters', () => {
      const result = escape('Tom & Jerry')
      expect(result).toBe('Tom &amp; Jerry')
    })

    it('should escape less-than characters', () => {
      const result = escape('if (x < 5)')
      expect(result).toBe('if (x &lt; 5)')
    })

    it('should escape greater-than characters', () => {
      const result = escape('if (x > 5)')
      expect(result).toBe('if (x &gt; 5)')
    })

    it('should escape single quotes', () => {
      const result = escape("It's working")
      expect(result).toBe('It&#39;s working')
    })

    it('should escape double quotes', () => {
      const result = escape('He said "Hello"')
      expect(result).toBe('He said &quot;Hello&quot;')
    })

    it('should escape multiple characters in one string', () => {
      const result = escape('Tom & Jerry: "Fun & Games" <script>')
      expect(result).toBe('Tom &amp; Jerry: &quot;Fun &amp; Games&quot; &lt;script&gt;')
    })

    it('should handle script tags safely', () => {
      const result = escape('<script>alert("XSS")</script>')
      expect(result).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')
    })

    it('should handle HTML elements', () => {
      const result = escape('<div class="test">Hello</div>')
      expect(result).toBe('&lt;div class=&quot;test&quot;&gt;Hello&lt;/div&gt;')
    })

    it('should return empty string for falsy values', () => {
      expect(escape('')).toBe('')
      expect(escape(null)).toBe(null)
      expect(escape(undefined)).toBe(undefined)
      expect(escape(false)).toBe(false)
      expect(escape(0)).toBe(0)
    })

    it('should handle strings with no special characters', () => {
      const result = escape('Hello World')
      expect(result).toBe('Hello World')
    })

    it('should handle mixed content safely', () => {
      const result = escape("User input: <img src='x' onerror=\"alert('XSS')\">")
      expect(result).toBe(
        'User input: &lt;img src=&#39;x&#39; onerror=&quot;alert(&#39;XSS&#39;)&quot;&gt;'
      )
    })
  })
})
