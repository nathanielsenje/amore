const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  tasks: {
    getAll: () => ipcRenderer.invoke('tasks:getAll'),
    getByDate: (date) => ipcRenderer.invoke('tasks:getByDate', date),
    getSomeday: () => ipcRenderer.invoke('tasks:getSomeday'),
    getSubtasks: (parentId) => ipcRenderer.invoke('tasks:getSubtasks', parentId),
    create: (task) => ipcRenderer.invoke('tasks:create', task),
    update: (id, updates) => ipcRenderer.invoke('tasks:update', id, updates),
    delete: (id) => ipcRenderer.invoke('tasks:delete', id),
  },
  recurring: {
    create: (taskId, config) => ipcRenderer.invoke('recurring:create', taskId, config),
    getTemplate: (taskId) => ipcRenderer.invoke('recurring:getTemplate', taskId),
    getInstances: (startDate, endDate) => ipcRenderer.invoke('recurring:getInstances', startDate, endDate),
    toggleCompletion: (templateId, date, completed) => ipcRenderer.invoke('recurring:toggleCompletion', templateId, date, completed),
  },
  settings: {
    get: (key) => ipcRenderer.invoke('settings:get', key),
    set: (key, value) => ipcRenderer.invoke('settings:set', key, value),
  },
})
