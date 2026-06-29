import type { SystemTheme } from './ui'

// ===========================
// SITE CONFIGURATION
// ===========================

export interface LegalLink {
  title: string
  url: string
}

export interface SiteMetadata {
  title: string
  author: string
  headerTitle: string
  description: string
  language: string
  theme: SystemTheme
  siteUrl: string
  siteLogo: string
  image: string
  socialBanner: string
  email: string
  github: string
  facebook: string
  instagram: string
  youtube: string
  linkedin: string
  locale: string
  gtmId?: string
  legal: LegalLink[]
}
