import React from 'react'

const PRESET_COLORS = [
  { name: 'Blue', value: '#4A90E2' },
  { name: 'Purple', value: '#9B51E0' },
  { name: 'Green', value: '#27AE60' },
  { name: 'Orange', value: '#F2994A' },
  { name: 'Red', value: '#EB5757' },
  { name: 'Yellow', value: '#F2C94C' },
]

export function ColorPicker({ selected, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Color
      </label>
      <div className="flex space-x-2">
        {PRESET_COLORS.map(color => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={`
              w-8 h-8 rounded-full border-2 transition-all
              ${selected === color.value
                ? 'border-gray-900 dark:border-white scale-110'
                : 'border-transparent hover:scale-105'
              }
            `}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  )
}
