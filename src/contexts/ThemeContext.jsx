import React, { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    async function loadTheme() {
      const savedTheme = await window.electronAPI.settings.get('theme')
      if (savedTheme) {
        setTheme(savedTheme.mode)
        applyTheme(savedTheme.mode)
      }
    }
    loadTheme()
  }, [])

  const applyTheme = (mode) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
    await window.electronAPI.settings.set('theme', { mode: newTheme })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
