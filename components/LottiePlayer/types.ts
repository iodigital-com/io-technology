import { CSSProperties } from 'react'

export interface LottiePlayerProps {
  src: string
  autoplay?: boolean
  loop?: boolean
  controls?: boolean
  speed?: number
  direction?: 1 | -1
  hover?: boolean
  click?: boolean
  mode?: 'normal' | 'bounce'
  style?: CSSProperties
  className?: string
}
