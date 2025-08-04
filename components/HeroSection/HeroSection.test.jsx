import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../tests/test-utils'
import HeroSection from './HeroSection'

// Mock the Image component
vi.mock('../Image', () => ({
  default: ({ src, alt, className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} data-testid="hero-image" />
  ),
}))

// Mock the HubspotForm component
vi.mock('../HubspotForm', () => ({
  default: ({ portalId, formId }) => (
    <div data-testid="hubspot-form">
      Form: {portalId}-{formId}
    </div>
  ),
}))

// Mock the useBrandingTheme hook
vi.mock('../../lib/hooks/useBrandingTheme', () => ({
  useBrandingTheme: () => ({ theme: 'blue' }),
}))

describe('HeroSection', () => {
  const defaultProps = {
    title: 'Welcome to Our Blog',
    description: 'This is an awesome blog about technology',
    imageSrc: '/hero-image.jpg',
    imageAlt: 'Hero image description',
  }

  it('renders without crashing', () => {
    const { container } = render(<HeroSection {...defaultProps} />)
    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
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

  it('renders the image with correct props', () => {
    render(<HeroSection {...defaultProps} />)
    const image = screen.getByTestId('hero-image')

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/hero-image.jpg')
    expect(image).toHaveAttribute('alt', 'Hero image description')
    expect(image).toHaveClass('h-auto', 'w-full', 'rounded-full')
  })

  it('uses default imageAlt when not provided', () => {
    const propsWithoutAlt = { ...defaultProps }
    delete propsWithoutAlt.imageAlt

    render(<HeroSection {...propsWithoutAlt} />)
    const image = screen.getByTestId('hero-image')
    expect(image).toHaveAttribute('alt', '')
  })

  it('applies correct theme background class', () => {
    const { container } = render(<HeroSection {...defaultProps} />)
    const section = container.querySelector('section')

    expect(section).toHaveClass('bg-io_blue-500')
  })

  it('does not render description when not provided', () => {
    const propsWithoutDescription = { ...defaultProps }
    delete propsWithoutDescription.description

    render(<HeroSection {...propsWithoutDescription} />)
    expect(screen.queryByText('This is an awesome blog about technology')).not.toBeInTheDocument()
  })

  it('renders HubspotForm when showForm is true and formConfig is provided', () => {
    const propsWithForm = {
      ...defaultProps,
      showForm: true,
      formConfig: { portalId: '12345', formId: 'abc-123' },
    }

    render(<HeroSection {...propsWithForm} />)
    expect(screen.getByTestId('hubspot-form')).toBeInTheDocument()
    expect(screen.getByText('Form: 12345-abc-123')).toBeInTheDocument()
  })

  it('does not render HubspotForm when showForm is false', () => {
    const propsWithoutForm = {
      ...defaultProps,
      showForm: false,
      formConfig: { portalId: '12345', formId: 'abc-123' },
    }

    render(<HeroSection {...propsWithoutForm} />)
    expect(screen.queryByTestId('hubspot-form')).not.toBeInTheDocument()
  })

  it('does not render HubspotForm when formConfig is not provided', () => {
    const propsWithoutFormConfig = {
      ...defaultProps,
      showForm: true,
      formConfig: null,
    }

    render(<HeroSection {...propsWithoutFormConfig} />)
    expect(screen.queryByTestId('hubspot-form')).not.toBeInTheDocument()
  })

  it('handles imagePosition prop for layout classes', () => {
    const propsWithLeftImage = {
      ...defaultProps,
      imagePosition: 'left',
    }

    const { container } = render(<HeroSection {...propsWithLeftImage} />)
    const imageContainer = container.querySelector('.col-start-1.col-end-12.mb-8')

    expect(imageContainer).toBeInTheDocument()
  })
})
