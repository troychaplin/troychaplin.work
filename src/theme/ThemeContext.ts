import { createContext } from 'react'

/**
 * `system` is the absence of an override: no `data-theme` attribute is set, so
 * the `prefers-color-scheme` media query in _tokens.scss drives the palette on
 * its own — no JavaScript involved in the colours.
 */
export type Theme = 'system' | 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
