import React from 'react'

export function FloatingAddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-transform hover:scale-110"
      title="Add task"
    >
      +
    </button>
  )
}
