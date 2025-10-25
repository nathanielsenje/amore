import React, { useEffect, useState } from 'react'
import { useTasks } from './hooks/useTasks'
import { TitleBar } from './components/TitleBar'
import { WeekView } from './components/WeekView'
import { SomedaySection } from './components/SomedaySection'
import { TaskEditor } from './components/TaskEditor'
import { FloatingAddButton } from './components/FloatingAddButton'

function App() {
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
      {/* Custom Title Bar */}
      <TitleBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <WeekView onEditTask={handleOpenEditor} />
        </div>

        <SomedaySection onEditTask={handleOpenEditor} />
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
