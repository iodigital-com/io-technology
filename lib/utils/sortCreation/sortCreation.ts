import type { WithCreationDate } from './types'

const sortCreation = <T extends WithCreationDate>(a: T, b: T): number =>
  new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()

export default sortCreation
