import React from 'react'

export function DayHeader({ dayName, dayNumber, monthAbbr, isToday }) {
  return (
    <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex flex-col items-center">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          {dayName}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className={`
            text-3xl font-bold tracking-tight
            ${isToday
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-900 dark:text-white'
            }
          `}>
            {dayNumber}
          </span>
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
            {monthAbbr}
          </span>
        </div>
      </div>
    </div>
  )
}
