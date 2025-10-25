import React from 'react'

export function DayHeader({ dayName, dayNumber, isToday }) {
  return (
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
          {dayName}
        </span>
        <span className={`
          mt-1 text-2xl font-semibold
          ${isToday
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-900 dark:text-white'
          }
        `}>
          {dayNumber}
        </span>
      </div>
    </div>
  )
}
