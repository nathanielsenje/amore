const Database = require('better-sqlite3')
const path = require('path')
const { app } = require('electron')

let db = null

function initDatabase() {
  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'amore.db')

  db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'development' ? console.log : undefined })

  // Enable foreign keys
  db.pragma('foreign_keys = ON')

  return db
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase,
}
