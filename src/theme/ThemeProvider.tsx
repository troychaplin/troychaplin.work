import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type Theme,
  type ThemeContextValue,
} from './ThemeContext'

function isTheme(value: string | null): value is Theme {
  return value === 'system' || value === 'light' || value === 'dark'
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : 'system'
  } catch {
    // Storage access throws outright in some privacy configurations.
    return 'system'
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.dataset.theme = theme
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Non-fatal: the theme still applies for this session.
    }
  }, [theme])

  const handleSetTheme = useCallback((next: Theme) => {
    setTheme(next)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme: handleSetTheme }),
    [theme, handleSetTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
