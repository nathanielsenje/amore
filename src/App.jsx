import React, { useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import { useTasks } from './hooks/useTasks'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { tasks, fetchTasks } = useTasks()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Amore
          </h1>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-400">
            Tasks: {tasks.length}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
