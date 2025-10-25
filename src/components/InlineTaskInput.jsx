import React, { useState, useRef, useEffect } from 'react'
import { useTasks } from '../hooks/useTasks'

export function InlineTaskInput({ date, onComplete, onCancel }) {
  const [title, setTitle] = useState('')
  const inputRef = useRef(null)
  const { createTask } = useTasks()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSave = async () => {
    if (title.trim()) {
      await createTask({
        title: title.trim(),
        date,
        color: '#3B82F6', // Blue color
      })
      setTitle('')
      onComplete?.()
    } else {
      onCancel?.()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      onCancel?.()
    }
  }

  return (
    <div className="px-3 py-2 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border-2 border-blue-200 dark:border-blue-800">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        placeholder="Task title..."
        className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
      />
    </div>
  )
}
