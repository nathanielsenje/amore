import React from 'react'
import { DayHeader } from './DayHeader'

export function DayColumn({ date, dayName, dayNumber, isToday, tasks }) {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 min-h-[500px]">
      <DayHeader
        dayName={dayName}
        dayNumber={dayNumber}
        isToday={isToday}
      />
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center mt-4">
            No tasks
          </p>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-600"
              style={{ borderLeftColor: task.color, borderLeftWidth: '4px' }}
            >
              <p className="text-sm text-gray-900 dark:text-white">
                {task.title}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
