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

  // Get month and year for header
  const monthYear = weekDays.length > 0
    ? formatDate(weekDays[0], 'MMM yyyy')
    : formatDate(new Date(), 'MMM yyyy')

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Week Navigation */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          {monthYear}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 shadow-sm hover:shadow-md transition-all"
          >
            Today
          </button>
          <button
            onClick={handlePrevWeek}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <div className="grid grid-cols-6 gap-0 h-full divide-x divide-gray-200 dark:divide-gray-700">
          {/* Sun - Thu: Regular columns */}
          {weekDays.slice(0, 5).map(day => {
            const headerInfo = formatDayHeader(day)
            return (
              <DayColumn
                key={headerInfo.fullDate}
                date={day}
                dayName={headerInfo.dayName}
                dayNumber={headerInfo.dayNumber}
                monthAbbr={headerInfo.monthAbbr}
                isToday={headerInfo.isToday}
                tasks={getTasksForDate(day)}
                onEditTask={(task, date) => onEditTask(task, date)}
              />
            )
          })}

          {/* Fri/Sat: Combined column */}
          <div className="flex flex-col h-full">
            {weekDays.slice(5, 7).map((day, index) => {
              const headerInfo = formatDayHeader(day)
              return (
                <div
                  key={headerInfo.fullDate}
                  className={`flex-1 ${index === 0 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                >
                  <DayColumn
                    date={day}
                    dayName={headerInfo.dayName}
                    dayNumber={headerInfo.dayNumber}
                    monthAbbr={headerInfo.monthAbbr}
                    isToday={headerInfo.isToday}
                    tasks={getTasksForDate(day)}
                    onEditTask={(task, date) => onEditTask(task, date)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
