import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { BrandingTheme } from '../../types'

type ThemeType = 'default' | 'green' | 'beige' | 'blue' | 'pink'

const ALLOWED_THEME_TYPES: ThemeType[] = ['default', 'green', 'beige', 'blue', 'pink']

const DEFAULT: BrandingTheme = {
  theme: 'blue', // Changed to match types definition
}

const ThemeContext = createContext<BrandingTheme>(DEFAULT)

const onlyAllowedThemeType = (theme: string): ThemeType =>
  ALLOWED_THEME_TYPES.includes(theme as ThemeType) ? (theme as ThemeType) : 'default'

interface ThemeProviderProps {
  children: ReactNode
  theme: string
}

const InnerThemeContextProvider = ({ children, theme }: ThemeProviderProps) => {
  const [state, setState] = useState<BrandingTheme>({
    theme: onlyAllowedThemeType(theme) as any, // Will be fixed with proper theme mapping
  })

  useEffect(() => {
    setState({ theme: onlyAllowedThemeType(theme) as any })
  }, [theme])

  return <ThemeContext.Provider value={state}>{children}</ThemeContext.Provider>
}

export const BrandingThemeProvider = InnerThemeContextProvider

export const useBrandingTheme = (): BrandingTheme => useContext(ThemeContext)
