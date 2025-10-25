import React from 'react'

export function Checkbox({ checked, onChange, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  }

  return (
    <button
      onClick={onChange}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded border-2
        ${checked
          ? 'bg-blue-500 border-blue-500'
          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
        }
        hover:border-blue-400
        transition-colors
      `}
      aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  )
}
