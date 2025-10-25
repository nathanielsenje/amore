import React, { useState, useEffect } from 'react'
import { DayColumn } from './DayColumn'
import { getWeekDays, formatDayHeader, formatDate, navigateWeek } from '../utils/dateUtils'
import { useTasks } from '../hooks/useTasks'

export function WeekView({ onEditTask }) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [weekDays, setWeekDays] = useState([])
  const [recurringInstances, setRecurringInstances] = useState([])
  const { tasks } = useTasks()

  useEffect(() => {
    const days = getWeekDays(currentWeek, 0) // 0 = Sunday
    setWeekDays(days)
    loadRecurringInstances(days)
  }, [currentWeek])

  const loadRecurringInstances = async (days) => {
    if (days.length === 0) return
    const startDate = formatDate(days[0])
    const endDate = formatDate(days[days.length - 1])
    const instances = await window.electronAPI.recurring.getInstances(startDate, endDate)
    setRecurringInstances(instances)
  }

  const getTasksForDate = (date) => {
    const dateStr = formatDate(date)

    // Regular tasks
    const regularTasks = tasks.filter(task => task.date === dateStr && !task.parent_id)

    // Recurring instances
    const recurring = recurringInstances.filter(inst => inst.date === dateStr)

    return [...regularTasks, ...recurring]
  }

  const handlePrevWeek = () => {
    setCurrentWeek(prev => navigateWeek(prev, 'prev'))
  }

  const handleNextWeek = () => {
    setCurrentWeek(prev => navigateWeek(prev, 'next'))
  }

  const handleToday = () => {
    setCurrentWeek(new Date())
  }

  return (
    <div className="flex flex-col h-full">
      {/* Week Navigation */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrevWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <span className="text-gray-600 dark:text-gray-300">←</span>
          </button>
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Today
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <span className="text-gray-600 dark:text-gray-300">→</span>
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="grid grid-cols-7 gap-3 h-full">
          {weekDays.map(day => {
            const headerInfo = formatDayHeader(day)
            return (
              <DayColumn
                key={headerInfo.fullDate}
                date={day}
                dayName={headerInfo.dayName}
                dayNumber={headerInfo.dayNumber}
                isToday={headerInfo.isToday}
                tasks={getTasksForDate(day)}
                onEditTask={onEditTask}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
