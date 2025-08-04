import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../tests/test-utils'
import Pagination from './Pagination'

// Mock the Link component
vi.mock('../Link', () => ({
  default: ({ href, rel, className, children }) => (
    <a href={href} rel={rel} className={className} data-testid="pagination-link">
      {children}
    </a>
  ),
}))

// Mock the Arrow SVG
vi.mock('../../data/arrow.svg', () => ({
  default: ({ className }) => (
    <svg className={className} data-testid="arrow-icon">
      <path d="arrow" />
    </svg>
  ),
}))

describe('Pagination', () => {
  const defaultProps = {
    totalPages: 5,
    currentPage: 3,
    subpath: 'articles',
  }

  it('renders current page information', () => {
    render(<Pagination {...defaultProps} />)

    expect(screen.getByText('3 of 5')).toBeInTheDocument()
  })

  it('renders previous link when not on first page', () => {
    render(<Pagination {...defaultProps} />)

    const prevLinks = screen.getAllByTestId('pagination-link')
    const prevLink = prevLinks.find((link) => link.textContent.includes('Previous'))

    expect(prevLink).toBeInTheDocument()
    expect(prevLink).toHaveAttribute('href', '/articles/page/2')
    expect(prevLink).toHaveAttribute('rel', 'previous')
  })

  it('renders next link when not on last page', () => {
    render(<Pagination {...defaultProps} />)

    const nextLinks = screen.getAllByTestId('pagination-link')
    const nextLink = nextLinks.find((link) => link.textContent.includes('Next'))

    expect(nextLink).toBeInTheDocument()
    expect(nextLink).toHaveAttribute('href', '/articles/page/4')
    expect(nextLink).toHaveAttribute('rel', 'next')
  })

  it('renders disabled previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)

    const prevButton = screen.getByRole('button', { name: /previous/i })
    expect(prevButton).toBeDisabled()
    expect(prevButton).toHaveClass('cursor-auto', 'disabled:opacity-50')
  })

  it('renders disabled next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />)

    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toBeDisabled()
    expect(nextButton).toHaveClass('cursor-auto', 'disabled:opacity-50')
  })

  it('renders correct href for previous page when current page is 2', () => {
    render(<Pagination {...defaultProps} currentPage={2} />)

    const prevLinks = screen.getAllByTestId('pagination-link')
    const prevLink = prevLinks.find((link) => link.textContent.includes('Previous'))

    expect(prevLink).toHaveAttribute('href', '/articles/')
  })

  it('uses custom subpath correctly', () => {
    render(<Pagination {...defaultProps} subpath="talks" />)

    const links = screen.getAllByTestId('pagination-link')
    const prevLink = links.find((link) => link.textContent.includes('Previous'))
    const nextLink = links.find((link) => link.textContent.includes('Next'))

    expect(prevLink).toHaveAttribute('href', '/talks/page/2')
    expect(nextLink).toHaveAttribute('href', '/talks/page/4')
  })

  it('handles single page correctly', () => {
    render(<Pagination totalPages={1} currentPage={1} />)

    expect(screen.getByText('1 of 1')).toBeInTheDocument()

    const prevButton = screen.getByRole('button', { name: /previous/i })
    const nextButton = screen.getByRole('button', { name: /next/i })

    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
  })

  it('renders arrow icons with correct classes', () => {
    render(<Pagination {...defaultProps} />)

    const arrows = screen.getAllByTestId('arrow-icon')

    // Previous arrow should be rotated
    expect(arrows[0]).toHaveClass('mr-4', 'w-6', 'rotate-180')
    // Next arrow should not be rotated
    expect(arrows[1]).toHaveClass('ml-4', 'w-6')
  })

  it('applies correct button classes', () => {
    render(<Pagination {...defaultProps} />)

    const links = screen.getAllByTestId('pagination-link')

    links.forEach((link) => {
      expect(link).toHaveClass(
        'relative',
        'inline-flex',
        'rounded-full',
        'border',
        'border-black',
        'py-4',
        'px-9',
        'text-base',
        'font-bold',
        'leading-none',
        'transition-colors',
        'delay-100',
        'hover:bg-black',
        'hover:text-white'
      )
    })
  })

  it('handles string numbers correctly', () => {
    render(<Pagination totalPages={5} currentPage={3} />)

    expect(screen.getByText('3 of 5')).toBeInTheDocument()

    const links = screen.getAllByTestId('pagination-link')
    const prevLink = links.find((link) => link.textContent.includes('Previous'))
    const nextLink = links.find((link) => link.textContent.includes('Next'))

    expect(prevLink).toHaveAttribute('href', '/articles/page/2')
    expect(nextLink).toHaveAttribute('href', '/articles/page/4')
  })
})
