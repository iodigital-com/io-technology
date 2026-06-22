import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../tests/test-utils'
import HeroSection from './HeroSection'

describe('HeroSection', () => {
  const defaultProps = {
    title: 'Welcome to Our Blog',
    description: 'This is an awesome blog about technology',
    isDarkBackground: false,
  }

  it('renders without crashing when no props are provided', () => {
    const { container } = render(<HeroSection />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    const { container } = render(<HeroSection {...defaultProps} />)
    const mainWrapper = container.querySelector('div.relative')
    expect(mainWrapper).toBeInTheDocument()
  })

  it('renders the title correctly', () => {
    render(<HeroSection {...defaultProps} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Welcome to Our Blog')).toBeInTheDocument()
  })

  it('renders the description when provided', () => {
    render(<HeroSection {...defaultProps} />)
    expect(screen.getByText('This is an awesome blog about technology')).toBeInTheDocument()
  })

  it('does not render title when not provided', () => {
    const propsWithoutTitle = { ...defaultProps }
    delete propsWithoutTitle.title

    render(<HeroSection {...propsWithoutTitle} />)
    expect(screen.queryByText('Welcome to Our Blog')).not.toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const propsWithoutDescription = { ...defaultProps }
    delete propsWithoutDescription.description

    render(<HeroSection {...propsWithoutDescription} />)
    expect(screen.queryByText('This is an awesome blog about technology')).not.toBeInTheDocument()
  })

  it('applies text-white class to title and description when isDarkBackground is true', () => {
    render(<HeroSection {...defaultProps} isDarkBackground={true} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-white')
    expect(screen.getByText(defaultProps.description).closest('span')).toHaveClass('text-white')
  })

  it('does not apply text-white class to title and description when isDarkBackground is false', () => {
    render(<HeroSection {...defaultProps} isDarkBackground={false} />)

    expect(screen.getByRole('heading', { level: 1 })).not.toHaveClass('text-white')
    expect(screen.getByText(defaultProps.description).closest('span')).not.toHaveClass('text-white')
  })

  it('renders children when provided', () => {
    render(
      <HeroSection {...defaultProps}>
        <div>Child content</div>
      </HeroSection>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('background overlay has aria-hidden attribute', () => {
    const { container } = render(<HeroSection {...defaultProps} />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })
})
