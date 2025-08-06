import NextImage from 'next/image'
import type { ImageProps } from './types'

// eslint-disable-next-line jsx-a11y/alt-text
const Image = ({ ...rest }: ImageProps) => <NextImage {...rest} />

export default Image
