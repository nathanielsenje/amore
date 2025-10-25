import React, { useEffect, useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    // Test creating and fetching tasks
    async function testDatabase() {
      await window.electronAPI.tasks.create({
        title: 'Test Task',
        description: 'Testing database',
        date: '2025-10-25',
      })

      const allTasks = await window.electronAPI.tasks.getAll()
      setTasks(allTasks)
    }

    testDatabase()
  }, [])

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Amore
        </h1>
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Tasks: {tasks.length}
          </h2>
          <ul className="mt-2">
            {tasks.map(task => (
              <li key={task.id} className="text-gray-600 dark:text-gray-400">
                {task.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
