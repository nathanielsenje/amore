function runMigrations(db) {
  // Create tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#4A90E2',
      date TEXT,
      completed INTEGER DEFAULT 0,
      position INTEGER DEFAULT 0,
      parent_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE
    )
  `)

  // Create recurring templates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recurring_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      interval_type TEXT NOT NULL,
      interval_value INTEGER DEFAULT 1,
      days_of_week TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    )
  `)

  // Create recurring completions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recurring_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      template_id INTEGER NOT NULL,
      completion_date TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (template_id) REFERENCES recurring_templates(id) ON DELETE CASCADE,
      UNIQUE(template_id, completion_date)
    )
  `)

  // Create settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `)

  // Insert default settings
  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)')
  insertSetting.run('theme', JSON.stringify({ mode: 'light' }))
  insertSetting.run('week_start_day', JSON.stringify(0)) // 0 = Sunday

  console.log('Database migrations completed')
}

module.exports = { runMigrations }
