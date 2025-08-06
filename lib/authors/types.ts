import type { Author, FrontMatter } from '../../types'

export interface AuthorsMap {
  [key: string]: Author
}

export interface AuthorWithContent extends Author {
  posts?: FrontMatter[]
  talks?: FrontMatter[]
  workshops?: FrontMatter[]
}
