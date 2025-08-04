import fs from 'fs'
import path from 'path'
import type { FileProcessor, MapFunction } from './types'

const pipe =
  <T>(...fns: Array<(input: T) => T>): FileProcessor<T> =>
  (x: T): T =>
    fns.reduce((v, f) => f(v), x)

const flattenArray = <T>(input: T[]): T[] =>
  input.reduce((acc: T[], item: T) => [...acc, ...(Array.isArray(item) ? item : [item])], [])

const map: MapFunction<any, any> =
  <T, R>(fn: (item: T) => R) =>
  (input: T[]): R[] =>
    input.map(fn)

const walkDir = (fullPath: string): string[] => {
  return fs.statSync(fullPath).isFile() ? [fullPath] : getAllFilesRecursively(fullPath)
}

const pathJoinPrefix =
  (prefix: string) =>
  (extraPath: string): string =>
    path.join(prefix, extraPath)

const getAllFilesRecursively = (folder: string): string[] =>
  pipe<string[]>(
    flattenArray,
    map(walkDir),
    flattenArray
  )(fs.readdirSync(folder).map(pathJoinPrefix(folder)))

export default getAllFilesRecursively
