import React from 'react'
import { useTheme } from '../hooks/useTheme'

export function TitleBar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="drag-region h-11 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-20">
      <div className="flex-1"></div>

      <h1 className="text-sm font-semibold text-gray-900 dark:text-white select-none">
        Amore
      </h1>

      <div className="flex-1 flex justify-end no-drag">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Toggle theme"
        >
          <span className="text-base">{theme === 'light' ? '🌙' : '☀️'}</span>
        </button>
      </div>
    </div>
  )
}
