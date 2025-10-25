import React, { useState, useEffect } from 'react'
import { Checkbox } from './Checkbox'
import { useTasks } from '../hooks/useTasks'

export function SubtaskList({ parentId }) {
  const [subtasks, setSubtasks] = useState([])
  const [isExpanded, setIsExpanded] = useState(true)
  const { toggleTaskComplete } = useTasks()

  useEffect(() => {
    loadSubtasks()
  }, [parentId])

  async function loadSubtasks() {
    const subs = await window.electronAPI.tasks.getSubtasks(parentId)
    setSubtasks(subs)
  }

  const handleToggle = async (subtask) => {
    await toggleTaskComplete(subtask.id, !subtask.completed)
    await loadSubtasks()
  }

  if (subtasks.length === 0) return null

  return (
    <div className="mt-2 pl-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-1"
      >
        {isExpanded ? '▼' : '▶'} {subtasks.length} subtask{subtasks.length !== 1 ? 's' : ''}
      </button>

      {isExpanded && (
        <div className="space-y-1 mt-1">
          {subtasks.map(subtask => (
            <div key={subtask.id} className="flex items-start space-x-2 group">
              <Checkbox
                checked={!!subtask.completed}
                onChange={() => handleToggle(subtask)}
                size="sm"
              />
              <span className={`
                text-xs flex-1
                ${subtask.completed
                  ? 'line-through text-gray-400 dark:text-gray-500'
                  : 'text-gray-700 dark:text-gray-300'
                }
              `}>
                {subtask.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
