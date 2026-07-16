import NextImage from 'next/image'
import type { ImageProps } from './types'

const Image = ({ ...rest }: ImageProps) => <NextImage {...rest} />

export default Image
