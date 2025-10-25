import React from 'react'
import { DayHeader } from './DayHeader'
import { TaskCard } from './TaskCard'
import { useTasks } from '../hooks/useTasks'

export function DayColumn({ date, dayName, dayNumber, isToday, tasks, onEditTask }) {
  const { deleteTask } = useTasks()

  const handleDelete = async (taskId) => {
    if (confirm('Delete this task?')) {
      await deleteTask(taskId)
    }
  }

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 min-h-[500px]">
      <DayHeader
        dayName={dayName}
        dayNumber={dayNumber}
        isToday={isToday}
      />
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center mt-4">
            No tasks
          </p>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
