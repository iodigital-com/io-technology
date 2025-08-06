import type { Author } from '../../types'

export interface AuthorInfoProps {
  authors: Author[]
  layout?: 'stacked' | 'inline' | 'grid'
  showOccupation?: boolean
  avatarSize?: 'small' | 'medium' | 'large'
  linkToAuthorPage?: boolean
}
