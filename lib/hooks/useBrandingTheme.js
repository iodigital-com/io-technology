import { createContext, useContext, useEffect, useState } from 'react'

const ALLOWED_THEME_TYPES = ['default', 'black', 'blue', 'orange', 'rouge']

const DEFAULT = {
  theme: 'default',
}

const ThemeContext = createContext(DEFAULT)

const onlyAllowedThemeType = (theme) => (ALLOWED_THEME_TYPES.includes(theme) ? theme : 'default')

const InnerThemeContextProvider = ({ children, theme }) => {
  const [state, setState] = useState({
    theme: onlyAllowedThemeType(theme),
  })

  useEffect(() => {
    setState({ theme: onlyAllowedThemeType(theme) })
  }, [theme])

  return <ThemeContext.Provider value={state}>{children}</ThemeContext.Provider>
}

export const BrandingThemeProvider = InnerThemeContextProvider

export const useBrandingTheme = () => useContext(ThemeContext)
