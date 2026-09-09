export interface WithCreationDate {
  creationDate: string
}

export type CreationDateComparator<T extends WithCreationDate> = (a: T, b: T) => number
