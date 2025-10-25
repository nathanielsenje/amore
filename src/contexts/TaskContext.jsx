import React, { createContext, useState, useCallback } from 'react'

export const TaskContext = createContext()

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [somedayTasks, setSomedayTasks] = useState([])

  const fetchTasks = useCallback(async () => {
    const allTasks = await window.electronAPI.tasks.getAll()
    const someday = await window.electronAPI.tasks.getSomeday()
    setTasks(allTasks)
    setSomedayTasks(someday)
  }, [])

  const createTask = useCallback(async (taskData) => {
    const newTask = await window.electronAPI.tasks.create(taskData)
    await fetchTasks()
    return newTask
  }, [fetchTasks])

  const updateTask = useCallback(async (id, updates) => {
    await window.electronAPI.tasks.update(id, updates)
    await fetchTasks()
  }, [fetchTasks])

  const deleteTask = useCallback(async (id) => {
    await window.electronAPI.tasks.delete(id)
    await fetchTasks()
  }, [fetchTasks])

  const toggleTaskComplete = useCallback(async (id, completed) => {
    await updateTask(id, { completed: completed ? 1 : 0 })
  }, [updateTask])

  return (
    <TaskContext.Provider value={{
      tasks,
      somedayTasks,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
    }}>
      {children}
    </TaskContext.Provider>
  )
}
