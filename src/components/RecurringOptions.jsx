import React, { useState } from 'react'

const WEEKDAYS = [
  { label: 'S', value: 0, name: 'Sunday' },
  { label: 'M', value: 1, name: 'Monday' },
  { label: 'T', value: 2, name: 'Tuesday' },
  { label: 'W', value: 3, name: 'Wednesday' },
  { label: 'T', value: 4, name: 'Thursday' },
  { label: 'F', value: 5, name: 'Friday' },
  { label: 'S', value: 6, name: 'Saturday' },
]

export function RecurringOptions({ config, onChange }) {
  const [intervalType, setIntervalType] = useState(config?.intervalType || 'none')
  const [intervalValue, setIntervalValue] = useState(config?.intervalValue || 1)
  const [daysOfWeek, setDaysOfWeek] = useState(config?.daysOfWeek || [])

  const handleTypeChange = (type) => {
    setIntervalType(type)
    onChange({
      intervalType: type,
      intervalValue: type === 'weekly' ? 1 : intervalValue,
      daysOfWeek: type === 'weekly' ? daysOfWeek : null,
    })
  }

  const handleIntervalChange = (value) => {
    setIntervalValue(value)
    onChange({
      intervalType,
      intervalValue: value,
      daysOfWeek: intervalType === 'weekly' ? daysOfWeek : null,
    })
  }

  const toggleDay = (day) => {
    const newDays = daysOfWeek.includes(day)
      ? daysOfWeek.filter(d => d !== day)
      : [...daysOfWeek, day].sort()

    setDaysOfWeek(newDays)
    onChange({
      intervalType,
      intervalValue,
      daysOfWeek: newDays,
    })
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Repeat
      </label>

      <select
        value={intervalType}
        onChange={(e) => handleTypeChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
      >
        <option value="none">Does not repeat</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      {intervalType === 'weekly' && (
        <div className="mt-3">
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
            Repeat on
          </label>
          <div className="flex space-x-1">
            {WEEKDAYS.map(day => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`
                  w-8 h-8 rounded-full text-xs font-medium transition-colors
                  ${daysOfWeek.includes(day.value)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }
                `}
                title={day.name}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {intervalType === 'daily' && (
        <div className="mt-3 flex items-center space-x-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Every
          </label>
          <input
            type="number"
            min="1"
            value={intervalValue}
            onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
            className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <label className="text-sm text-gray-600 dark:text-gray-400">
            day(s)
          </label>
        </div>
      )}
    </div>
  )
}
