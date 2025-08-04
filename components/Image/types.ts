import type { StaticImageData } from 'next/image'
import type { CSSProperties } from 'react'

// ===========================
// IMAGE COMPONENT TYPES
// ===========================

// Image source types
export type ImageSource = string | StaticImageData

// Image size variants
export type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

// Image fit options
export type ImageFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

// Base image props
export interface ImageProps {
  src: ImageSource
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  loading?: 'lazy' | 'eager'
  className?: string
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  style?: CSSProperties
  onLoad?: () => void
  onError?: () => void
}

// Enhanced image with responsive options
export interface ResponsiveImageProps extends Omit<ImageProps, 'sizes'> {
  sizes?: {
    mobile?: string
    tablet?: string
    desktop?: string
    default: string
  }
  aspectRatio?: string // e.g., "16/9", "4/3"
}

// Gallery image type
export interface GalleryImage {
  src: ImageSource
  alt: string
  caption?: string
  width?: number
  height?: number
}
