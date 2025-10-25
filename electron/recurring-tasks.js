const { getDatabase } = require('./database')

function createRecurringTemplate(taskId, config) {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO recurring_templates (task_id, interval_type, interval_value, days_of_week, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    taskId,
    config.intervalType,
    config.intervalValue || 1,
    config.daysOfWeek ? JSON.stringify(config.daysOfWeek) : null,
    config.startDate,
    config.endDate || null
  )

  return result.lastInsertRowid
}

function getRecurringTemplate(taskId) {
  const db = getDatabase()
  const template = db.prepare('SELECT * FROM recurring_templates WHERE task_id = ?').get(taskId)

  if (template && template.days_of_week) {
    template.days_of_week = JSON.parse(template.days_of_week)
  }

  return template
}

function generateRecurringInstances(templateId, startDate, endDate) {
  const db = getDatabase()

  // Get the template
  const template = db.prepare(`
    SELECT rt.*, t.*
    FROM recurring_templates rt
    JOIN tasks t ON rt.task_id = t.id
    WHERE rt.id = ?
  `).get(templateId)

  if (!template) return []

  const instances = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  const templateStart = new Date(template.start_date)
  const templateEnd = template.end_date ? new Date(template.end_date) : null

  let currentDate = new Date(Math.max(start.getTime(), templateStart.getTime()))

  while (currentDate <= end) {
    if (templateEnd && currentDate > templateEnd) break

    let shouldInclude = false

    switch (template.interval_type) {
      case 'daily':
        shouldInclude = true
        currentDate.setDate(currentDate.getDate() + template.interval_value)
        break

      case 'weekly':
        const dayOfWeek = currentDate.getDay()
        const daysOfWeek = template.days_of_week ? JSON.parse(template.days_of_week) : []
        if (daysOfWeek.includes(dayOfWeek)) {
          shouldInclude = true
        }
        currentDate.setDate(currentDate.getDate() + 1)
        break

      case 'monthly':
        shouldInclude = true
        currentDate.setMonth(currentDate.getMonth() + template.interval_value)
        break

      case 'yearly':
        shouldInclude = true
        currentDate.setFullYear(currentDate.getFullYear() + template.interval_value)
        break
    }

    if (shouldInclude && currentDate >= start && currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0]

      // Check if this instance is completed
      const completion = db.prepare(
        'SELECT completed FROM recurring_completions WHERE template_id = ? AND completion_date = ?'
      ).get(templateId, dateStr)

      instances.push({
        id: `recurring-${templateId}-${dateStr}`,
        templateId,
        title: template.title,
        description: template.description,
        color: template.color,
        date: dateStr,
        completed: completion ? completion.completed : 0,
        isRecurring: true,
      })
    }
  }

  return instances
}

function toggleRecurringCompletion(templateId, date, completed) {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO recurring_completions (template_id, completion_date, completed)
    VALUES (?, ?, ?)
    ON CONFLICT(template_id, completion_date)
    DO UPDATE SET completed = ?
  `)

  stmt.run(templateId, date, completed ? 1 : 0, completed ? 1 : 0)
}

function getAllRecurringInstances(startDate, endDate) {
  const db = getDatabase()
  const templates = db.prepare('SELECT id FROM recurring_templates').all()

  const allInstances = []
  templates.forEach(template => {
    const instances = generateRecurringInstances(template.id, startDate, endDate)
    allInstances.push(...instances)
  })

  return allInstances
}

module.exports = {
  createRecurringTemplate,
  getRecurringTemplate,
  generateRecurringInstances,
  toggleRecurringCompletion,
  getAllRecurringInstances,
}
