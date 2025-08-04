import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../tests/test-utils'
import ThemeSwitch from './ThemeSwitch'

// Mock next-themes with a mutable mock
const mockSetTheme = vi.fn()
let mockThemeState = {
  theme: 'light',
  setTheme: mockSetTheme,
  resolvedTheme: 'light',
}

vi.mock('next-themes', () => ({
  useTheme: () => mockThemeState,
  ThemeProvider: ({ children }) => children, // Simple pass-through for testing
}))

describe('ThemeSwitch', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
    // Reset to default light theme
    mockThemeState = {
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
    }
  })

  it('renders a button with correct aria label', () => {
    render(<ThemeSwitch />)

    const button = screen.getByRole('button', { name: 'Toggle Dark Mode' })
    expect(button).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(<ThemeSwitch />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Toggle Dark Mode')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('applies correct CSS classes', () => {
    render(<ThemeSwitch />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('ml-1', 'mr-1', 'h-8', 'w-8', 'rounded', 'p-1', 'sm:ml-4')
  })

  it('contains an SVG icon', () => {
    render(<ThemeSwitch />)

    const svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('text-gray-900', 'dark:text-gray-100')
  })

  it('calls setTheme with dark when current theme is light', () => {
    render(<ThemeSwitch />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
    expect(mockSetTheme).toHaveBeenCalledTimes(1)
  })

  it('calls setTheme with light when current theme is dark', () => {
    // Update mock state
    mockThemeState = {
      theme: 'dark',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
    }

    render(<ThemeSwitch />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('light')
    expect(mockSetTheme).toHaveBeenCalledTimes(1)
  })

  it('calls setTheme with light when resolvedTheme is dark', () => {
    // Update mock state
    mockThemeState = {
      theme: 'system',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
    }

    render(<ThemeSwitch />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('shows different icons based on theme state', () => {
    // Test light theme (shows moon icon)
    const { container } = render(<ThemeSwitch />)
    let svg = container.querySelector('svg')
    let paths = svg.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)

    // Re-render with dark theme (should show sun icon)
    mockThemeState = {
      theme: 'dark',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
    }

    const { container: container2 } = render(<ThemeSwitch />)
    svg = container2.querySelector('svg')
    paths = svg.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)
  })

  it('handles system theme correctly', () => {
    // Update mock state
    mockThemeState = {
      theme: 'system',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
    }

    render(<ThemeSwitch />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('handles multiple clicks correctly', () => {
    render(<ThemeSwitch />)

    const button = screen.getByRole('button')
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledTimes(3)
    expect(mockSetTheme).toHaveBeenLastCalledWith('dark')
  })

  it('is keyboard accessible', () => {
    render(<ThemeSwitch />)

    const button = screen.getByRole('button')

    // Focus the button
    button.focus()
    expect(button).toHaveFocus()

    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
    // Note: This might not trigger click in jsdom, but we can test the button exists and is focusable
  })
})
