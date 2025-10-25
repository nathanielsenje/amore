import React, { useState } from 'react'
import { DayHeader } from './DayHeader'
import { TaskCard } from './TaskCard'
import { InlineTaskInput } from './InlineTaskInput'
import { useTasks } from '../hooks/useTasks'
import { formatDate } from '../utils/dateUtils'

export function DayColumn({ date, dayName, dayNumber, monthAbbr, isToday, tasks, onEditTask }) {
  const { deleteTask, updateTask } = useTasks()
  const [isDragOver, setIsDragOver] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)

  const handleDelete = async (taskId) => {
    if (confirm('Delete this task?')) {
      await deleteTask(taskId)
    }
  }

  const handleAddTask = () => {
    setIsAddingTask(true)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragOver(false)

    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) {
      await updateTask(parseInt(taskId), { date: formatDate(date) })
    }
  }

  return (
    <div
      className={`flex flex-col bg-white dark:bg-gray-800 h-full transition-colors ${isDragOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DayHeader
        dayName={dayName}
        dayNumber={dayNumber}
        monthAbbr={monthAbbr}
        isToday={isToday}
      />

      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {/* Inline Task Input */}
        {isAddingTask && (
          <InlineTaskInput
            date={formatDate(date)}
            onComplete={() => setIsAddingTask(false)}
            onCancel={() => setIsAddingTask(false)}
          />
        )}

        {/* Add Task Button */}
        {!isAddingTask && (
          <button
            onClick={handleAddTask}
            className="w-full py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
          >
            + Add task
          </button>
        )}

        {/* Tasks */}
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
