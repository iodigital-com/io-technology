import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../tests/test-utils'
import ContributorsGrid from './ContributorsGrid'

// Mock the Contributor component
vi.mock('../Contributor', () => ({
  default: ({ contributor }) => (
    <div data-testid={`contributor-${contributor.slug[0]}`}>{contributor.frontMatter.name}</div>
  ),
}))

describe('ContributorsGrid', () => {
  const mockContributors = [
    {
      slug: ['john-doe'],
      frontMatter: {
        name: 'John Doe',
        avatar: '/authors/john-doe.jpg',
        occupation: 'Software Developer',
      },
    },
    {
      slug: ['jane-smith'],
      frontMatter: {
        name: 'Jane Smith',
        avatar: '/authors/jane-smith.jpg',
        occupation: 'UI/UX Designer',
      },
    },
    {
      slug: ['bob-wilson'],
      frontMatter: {
        name: 'Bob Wilson',
        avatar: '/authors/bob-wilson.jpg',
        occupation: 'DevOps Engineer',
      },
    },
  ]

  it('renders without crashing', () => {
    const { container } = render(<ContributorsGrid contributors={[]} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders all contributors', () => {
    render(<ContributorsGrid contributors={mockContributors} />)

    expect(screen.getByTestId('contributor-john-doe')).toBeInTheDocument()
    expect(screen.getByTestId('contributor-jane-smith')).toBeInTheDocument()
    expect(screen.getByTestId('contributor-bob-wilson')).toBeInTheDocument()
  })

  it('renders contributor names', () => {
    render(<ContributorsGrid contributors={mockContributors} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
  })

  it('applies correct CSS grid classes', () => {
    const { container } = render(<ContributorsGrid contributors={mockContributors} />)
    const gridElement = container.querySelector('.grid')

    expect(gridElement).toHaveClass('grid')
    expect(gridElement).toHaveClass('grid-cols-3')
    expect(gridElement).toHaveClass('gap-y-8')
    expect(gridElement).toHaveClass('md:grid-cols-4')
    expect(gridElement).toHaveClass('md:gap-y-10')
    expect(gridElement).toHaveClass('xl:grid-cols-5')
    expect(gridElement).toHaveClass('xl:gap-y-12')
  })

  it('handles empty contributors array', () => {
    const { container } = render(<ContributorsGrid contributors={[]} />)

    const gridElement = container.firstChild
    expect(gridElement.children).toHaveLength(0)
  })

  it('uses correct key for each contributor', () => {
    const { container } = render(<ContributorsGrid contributors={mockContributors} />)

    expect(container.querySelector('[data-testid="contributor-john-doe"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="contributor-jane-smith"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="contributor-bob-wilson"]')).toBeInTheDocument()
  })
})
