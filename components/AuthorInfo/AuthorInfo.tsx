import Image from '@/components/Image'
import Link from '@/components/Link'
import type { AuthorInfoProps } from './types'
import type { Author } from '../../types'

const AuthorInfo = ({
  authors,
  layout = 'stacked', // 'stacked', 'inline', 'grid'
  showOccupation = true,
  avatarSize = 'medium', // 'small', 'medium', 'large'
  linkToAuthorPage = true,
}: AuthorInfoProps) => {
  if (!authors || authors.length === 0) return null

  const getAvatarClasses = () => {
    switch (avatarSize) {
      case 'small':
        return 'h-10 w-10'
      case 'large':
        return 'md:h-16 md:w-16 xl:h-32 xl:w-32'
      default:
        return 'h-12 w-12'
    }
  }

  const renderSingleAuthor = (author: Author) => (
    <div key={author.name} className="flex items-center">
      <div className={`flex-0 relative mr-3 overflow-hidden rounded-full ${getAvatarClasses()}`}>
        <Image
          src={author.avatar || '/authors/io.jpg'}
          width={avatarSize === 'large' ? 200 : 100}
          height={avatarSize === 'large' ? 200 : 100}
          alt={`avatar ${author.name}`}
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <p className={`font-medium ${avatarSize === 'small' ? 'text-sm' : 'text-base'} mb-0`}>
          {linkToAuthorPage ? (
            <Link
              href={`/authors/${author.slug[0]}`}
              className={`text-io_energeticBlue-600 hover:text-io_energeticBlue-700`}
            >
              {author.name}
            </Link>
          ) : (
            author.name
          )}
        </p>
        {showOccupation && (
          <p className={`${avatarSize === 'small' ? 'text-sm' : 'text-base'} mb-0`}>
            {author.occupation}
          </p>
        )}
      </div>
    </div>
  )

  const renderStackedAvatars = () => (
    <div className="flex flex-col gap-4 xl:flex-row">
      <div className="flex items-center -space-x-6 xl:-space-x-12">
        {authors.map((author, index) => (
          <div
            key={author.name}
            className={`flex-0 relative overflow-hidden rounded-full border-4 border-white ${getAvatarClasses()}`}
            style={{ zIndex: authors.length - index }}
          >
            <Image
              src={author.avatar || '/authors/io.jpg'}
              width={avatarSize === 'large' ? 200 : 100}
              height={avatarSize === 'large' ? 200 : 100}
              alt={`avatar ${author.name}`}
              className="rounded-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="text-body-xs">
        {authors.map((author) => (
          <div key={author.name} className="mb-2">
            <p className="mb-0">
              {linkToAuthorPage ? (
                <Link
                  href={`/authors/${author.slug[0]}`}
                  className={`text-io_energeticBlue-600 hover:text-io_energeticBlue-800`}
                >
                  {author.name}
                </Link>
              ) : (
                author.name
              )}
            </p>
            {showOccupation && <p className="mb-0">{author.occupation}</p>}
          </div>
        ))}
      </div>
    </div>
  )

  switch (layout) {
    case 'stacked':
      return renderStackedAvatars()
    case 'inline':
      return (
        <div className="flex flex-col gap-3">
          {authors.map((author) => renderSingleAuthor(author))}
        </div>
      )
    case 'grid':
      return <div className="grid gap-3">{authors.map((author) => renderSingleAuthor(author))}</div>
    default:
      return renderStackedAvatars()
  }
}

export default AuthorInfo
