import { slug } from 'github-slugger'
import type { StringTransformer } from './types'

const kebabCase: StringTransformer = (str: string): string => slug(str)

export default kebabCase
