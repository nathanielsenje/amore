import React, { useState, useEffect } from 'react'
import { ColorPicker } from './ColorPicker'
import { RecurringOptions } from './RecurringOptions'
import { useTasks } from '../hooks/useTasks'
import { formatDate } from '../utils/dateUtils'

export function TaskEditor({ isOpen, onClose, task, initialDate }) {
  const { createTask, updateTask } = useTasks()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#4A90E2',
    date: initialDate || formatDate(new Date()),
  })
  const [subtasks, setSubtasks] = useState([])
  const [newSubtask, setNewSubtask] = useState('')
  const [recurringConfig, setRecurringConfig] = useState(null)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        color: task.color,
        date: task.date || '',
      })
      loadSubtasks()
    } else {
      resetForm()
    }
  }, [task, isOpen])

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      color: '#4A90E2',
      date: initialDate || formatDate(new Date()),
    })
    setSubtasks([])
    setNewSubtask('')
    setRecurringConfig(null)
  }

  const loadSubtasks = async () => {
    if (task?.id) {
      const subs = await window.electronAPI.tasks.getSubtasks(task.id)
      setSubtasks(subs)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) return

    if (task) {
      // Update existing task
      await updateTask(task.id, formData)
    } else {
      // Create new task
      const newTask = await createTask(formData)

      // Create recurring template if configured
      if (recurringConfig && recurringConfig.intervalType !== 'none') {
        await window.electronAPI.recurring.create(newTask.id, {
          ...recurringConfig,
          startDate: formData.date || formatDate(new Date()),
        })
      }

      // Create subtasks if any
      for (const subtask of subtasks) {
        if (subtask.title.trim()) {
          await createTask({
            title: subtask.title,
            parentId: newTask.id,
            date: formData.date,
          })
        }
      }
    }

    onClose()
  }

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { title: newSubtask, tempId: Date.now() }])
      setNewSubtask('')
    }
  }

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Task title"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Add details..."
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, date: null })}
              className="text-xs text-blue-600 dark:text-blue-400 mt-1 hover:underline"
            >
              Move to Someday
            </button>
          </div>

          {/* Color */}
          <ColorPicker
            selected={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
          />

          {/* Recurring */}
          {!task && (
            <RecurringOptions
              config={recurringConfig}
              onChange={setRecurringConfig}
            />
          )}

          {/* Subtasks */}
          {!task && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subtasks
              </label>
              <div className="space-y-2">
                {subtasks.map((subtask, index) => (
                  <div key={subtask.tempId || subtask.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={subtask.title}
                      readOnly
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Add subtask..."
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {task ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
