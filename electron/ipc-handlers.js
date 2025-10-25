const { ipcMain } = require('electron')
const { getDatabase } = require('./database')

function setupIpcHandlers() {
  // Get all tasks
  ipcMain.handle('tasks:getAll', () => {
    const db = getDatabase()
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY position ASC').all()
    return tasks
  })

  // Get tasks by date
  ipcMain.handle('tasks:getByDate', (event, date) => {
    const db = getDatabase()
    const tasks = db.prepare(
      'SELECT * FROM tasks WHERE date = ? ORDER BY position ASC'
    ).all(date)
    return tasks
  })

  // Get tasks without date (Someday)
  ipcMain.handle('tasks:getSomeday', () => {
    const db = getDatabase()
    const tasks = db.prepare(
      'SELECT * FROM tasks WHERE date IS NULL AND parent_id IS NULL ORDER BY position ASC'
    ).all()
    return tasks
  })

  // Get subtasks
  ipcMain.handle('tasks:getSubtasks', (event, parentId) => {
    const db = getDatabase()
    const subtasks = db.prepare(
      'SELECT * FROM tasks WHERE parent_id = ? ORDER BY position ASC'
    ).all(parentId)
    return subtasks
  })

  // Create task
  ipcMain.handle('tasks:create', (event, task) => {
    const db = getDatabase()
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, color, date, position, parent_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      task.title,
      task.description || null,
      task.color || '#4A90E2',
      task.date || null,
      task.position || 0,
      task.parentId || null
    )
    return { id: result.lastInsertRowid, ...task }
  })

  // Update task
  ipcMain.handle('tasks:update', (event, id, updates) => {
    const db = getDatabase()
    const fields = []
    const values = []

    Object.keys(updates).forEach(key => {
      fields.push(`${key} = ?`)
      values.push(updates[key])
    })

    values.push(id)

    const stmt = db.prepare(`
      UPDATE tasks
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    stmt.run(...values)
    return { id, ...updates }
  })

  // Delete task
  ipcMain.handle('tasks:delete', (event, id) => {
    const db = getDatabase()
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?')
    stmt.run(id)
    return { id }
  })

  // Settings
  ipcMain.handle('settings:get', (event, key) => {
    const db = getDatabase()
    const result = db.prepare('SELECT value FROM settings WHERE key = ?').get(key)
    return result ? JSON.parse(result.value) : null
  })

  ipcMain.handle('settings:set', (event, key, value) => {
    const db = getDatabase()
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
    stmt.run(key, JSON.stringify(value))
    return { key, value }
  })
}

module.exports = { setupIpcHandlers }
