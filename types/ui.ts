import type { ReactNode } from 'react'

// ===========================
// THEME SYSTEM
// ===========================
export type ThemeColor = 'blue' | 'green' | 'beige' | 'pink'
export type SystemTheme = 'light' | 'dark' | 'system'

// Enhanced branding theme
export interface BrandingTheme {
  theme: ThemeColor
  primaryColor?: string
  secondaryColor?: string
  customCSS?: string
}

// ===========================
// LAYOUT TYPES
// ===========================

export interface BaseLayoutProps {
  children: ReactNode
  className?: string
}

export interface LayoutProps extends BaseLayoutProps {
  // Additional layout props can be added here
}
