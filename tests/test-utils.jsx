import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'

// Custom render function that includes providers
export function renderWithProviders(ui, options = {}) {
  const { initialTheme = 'light', ...renderOptions } = options

  function Wrapper({ children }) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme={initialTheme}
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock data for testing
export const mockAuthor = {
  name: 'John Doe',
  slug: 'john-doe',
  avatar: '/authors/john-doe.jpg',
  occupation: 'Software Developer',
  company: 'Tech Corp',
  twitter: 'johndoe',
  linkedin: 'johndoe',
  github: 'johndoe',
  archived: false,
}

export const mockPost = {
  slug: 'test-post',
  title: 'Test Post Title',
  summary: 'This is a test post summary',
  date: '2024-01-15',
  tags: ['react', 'testing', 'javascript'],
  authors: ['john-doe'],
  readingTime: { text: '5 min read' },
}

export const mockContributor = {
  slug: ['john-doe'],
  frontMatter: {
    name: 'John Doe',
    avatar: '/authors/john-doe.jpg',
    occupation: 'Software Developer',
  },
}

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render method
export { renderWithProviders as render }
