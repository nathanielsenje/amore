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

  const handleDragStart = (e) => {
    // Don't allow dragging recurring tasks
    if (task.isRecurring) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('taskId', task.id.toString())
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable={!task.isRecurring}
      onDragStart={handleDragStart}
      className="task-card group px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all cursor-move"
      style={{
        borderLeftColor: task.color,
        borderLeftWidth: '3px',
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
