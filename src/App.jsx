import React, { useEffect, useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { useTasks } from './hooks/useTasks'
import { WeekView } from './components/WeekView'
import { TaskEditor } from './components/TaskEditor'
import { FloatingAddButton } from './components/FloatingAddButton'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { fetchTasks } = useTasks()
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleCloseEditor = () => {
    setIsEditorOpen(false)
    setEditingTask(null)
  }

  const handleOpenEditor = (task = null) => {
    setEditingTask(task)
    setIsEditorOpen(true)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Amore
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="Toggle theme"
        >
          <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <WeekView onEditTask={handleOpenEditor} />
      </div>

      {/* Floating Add Button */}
      <FloatingAddButton onClick={() => handleOpenEditor()} />

      {/* Task Editor Modal */}
      <TaskEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        task={editingTask}
      />
    </div>
  )
}

export default App
