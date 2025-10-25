import React from 'react'
import { Checkbox } from './Checkbox'
import { SubtaskList } from './SubtaskList'
import { useTasks } from '../hooks/useTasks'

export function TaskCard({ task, onEdit, onDelete }) {
  const { toggleTaskComplete } = useTasks()

  const handleToggle = async () => {
    if (task.isRecurring) {
      await window.electronAPI.recurring.toggleCompletion(
        task.templateId,
        task.date,
        !task.completed
      )
      // Refresh the view
      window.location.reload()
    } else {
      await toggleTaskComplete(task.id, !task.completed)
    }
  }

  return (
    <div
      className="task-card group p-3 rounded-lg bg-white dark:bg-gray-700 border-2 hover:shadow-md transition-shadow"
      style={{
        borderLeftColor: task.color,
        borderLeftWidth: '4px',
        borderTopColor: '#e5e7eb',
        borderRightColor: '#e5e7eb',
        borderBottomColor: '#e5e7eb',
      }}
    >
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={!!task.completed}
          onChange={handleToggle}
        />

        <div className="flex-1 min-w-0">
          <p className={`
            text-sm font-medium
            ${task.completed
              ? 'line-through text-gray-400 dark:text-gray-500'
              : 'text-gray-900 dark:text-white'
            }
          `}>
            {task.title}
          </p>

          {task.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {task.description}
            </p>
          )}

          {!task.isRecurring && <SubtaskList parentId={task.id} />}
        </div>

        {/* Actions - shown on hover (not for recurring) */}
        {!task.isRecurring && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            <button
              onClick={() => onEdit?.(task)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
              title="Edit task"
            >
              <span className="text-xs">✏️</span>
            </button>
            <button
              onClick={() => onDelete?.(task.id)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
              title="Delete task"
            >
              <span className="text-xs">🗑️</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
