import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../tests/test-utils'
import ContentListing from './ContentListing'

// Mock the ContentCard component
vi.mock('../ContentCard', () => ({
  default: ({ title, slug, type, layout, authors }) => (
    <div data-testid={`content-card-${slug}`} data-layout={layout} data-type={type}>
      <h3>{title}</h3>
      {authors &&
        authors.map((author, index) => (
          <span key={index} data-testid={`author-${author.name}`}>
            {author.name}
          </span>
        ))}
    </div>
  ),
}))

describe('ContentListing', () => {
  const mockAuthors = {
    'john-doe': {
      name: 'John Doe',
      occupation: 'Developer',
      archived: false,
    },
    'jane-smith': {
      name: 'Jane Smith',
      occupation: 'Designer',
      archived: true,
    },
    'bob-wilson': {
      name: 'Bob Wilson',
      occupation: 'DevOps',
      archived: false,
    },
  }

  const mockItems = [
    {
      slug: 'post-1',
      title: 'First Post',
      summary: 'This is the first post',
      date: '2024-01-01',
      tags: ['react'],
      authors: ['john-doe'],
    },
    {
      slug: 'post-2',
      title: 'Second Post',
      summary: 'This is the second post',
      date: '2024-01-02',
      tags: ['vue'],
      authors: ['jane-smith'],
    },
    {
      slug: 'post-3',
      title: 'Third Post',
      summary: 'This is the third post',
      date: '2024-01-03',
      tags: ['angular'],
      authors: ['bob-wilson'],
    },
  ]

  it('renders without crashing', () => {
    const { container } = render(<ContentListing items={[]} authors={{}} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders all items when no archived filter is applied', () => {
    render(<ContentListing items={mockItems} authors={mockAuthors} showArchivedFilter={false} />)

    expect(screen.getByTestId('content-card-post-1')).toBeInTheDocument()
    expect(screen.getByTestId('content-card-post-2')).toBeInTheDocument()
    expect(screen.getByTestId('content-card-post-3')).toBeInTheDocument()
  })

  it('filters out items from archived authors when showArchivedFilter is true', () => {
    render(<ContentListing items={mockItems} authors={mockAuthors} showArchivedFilter={true} />)

    expect(screen.getByTestId('content-card-post-1')).toBeInTheDocument()
    expect(screen.queryByTestId('content-card-post-2')).not.toBeInTheDocument() // jane-smith is archived
    expect(screen.getByTestId('content-card-post-3')).toBeInTheDocument()
  })

  it('shows "No items found" message when no items are provided', () => {
    render(<ContentListing items={[]} authors={mockAuthors} />)
    expect(screen.getByText('No items found.')).toBeInTheDocument()
  })

  it('shows "No items found" message when all items are filtered out', () => {
    const itemsFromArchivedAuthors = [
      {
        slug: 'archived-post',
        title: 'Archived Post',
        authors: ['jane-smith'],
      },
    ]

    render(
      <ContentListing
        items={itemsFromArchivedAuthors}
        authors={mockAuthors}
        showArchivedFilter={true}
      />
    )

    expect(screen.getByText('No items found.')).toBeInTheDocument()
  })

  it('applies grid layout classes by default', () => {
    const { container } = render(<ContentListing items={mockItems} authors={mockAuthors} />)

    const gridElement = container.querySelector('.grid')
    expect(gridElement).toHaveClass(
      'grid',
      'gap-y-10',
      'md:gap-x-4',
      'lg:grid-cols-2',
      'lg:gap-y-12',
      'xl:grid-cols-3',
      'xl:gap-x-6'
    )
  })

  it('does not apply grid classes when layout is list', () => {
    const { container } = render(
      <ContentListing items={mockItems} authors={mockAuthors} layout="list" />
    )

    const listElement = container.querySelector('.container')
    expect(listElement?.firstElementChild).not.toHaveClass('grid')
  })

  it('passes correct contentType to ContentCard', () => {
    render(<ContentListing items={mockItems} authors={mockAuthors} contentType="talk" />)

    const contentCard = screen.getByTestId('content-card-post-1')
    expect(contentCard).toHaveAttribute('data-type', 'talk')
  })

  it('handles items without authors', () => {
    const itemsWithoutAuthors = [
      {
        slug: 'no-author-post',
        title: 'Post Without Author',
        summary: 'This post has no authors',
      },
    ]

    render(
      <ContentListing items={itemsWithoutAuthors} authors={mockAuthors} showArchivedFilter={true} />
    )

    expect(screen.getByTestId('content-card-no-author-post')).toBeInTheDocument()
  })

  it('passes author details to ContentCard', () => {
    render(<ContentListing items={mockItems} authors={mockAuthors} />)

    expect(screen.getByTestId('author-John Doe')).toBeInTheDocument()
    expect(screen.getByTestId('author-Bob Wilson')).toBeInTheDocument()
  })

  it('applies custom containerClassName', () => {
    const customClass = 'custom-container-class'
    const { container } = render(
      <ContentListing items={mockItems} authors={mockAuthors} containerClassName={customClass} />
    )

    const elementWithClass = container.querySelector(`.${customClass}`)
    expect(elementWithClass).toBeInTheDocument()
  })
})
