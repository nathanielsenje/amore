import React from 'react'
import { TaskCard } from './TaskCard'
import { useTasks } from '../hooks/useTasks'

export function SomedaySection({ onEditTask }) {
  const { somedayTasks, deleteTask } = useTasks()

  const handleDelete = async (taskId) => {
    if (confirm('Delete this task?')) {
      await deleteTask(taskId)
    }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="px-6 py-3">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Someday
        </h2>
      </div>
      <div className="px-6 pb-6">
        <div className="grid grid-cols-4 gap-3">
          {somedayTasks.length === 0 ? (
            <p className="col-span-4 text-sm text-gray-400 dark:text-gray-500 text-center py-8">
              No unscheduled tasks
            </p>
          ) : (
            somedayTasks.map(task => (
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
    </div>
  )
}
