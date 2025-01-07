// src/js/TaskManager.js
export class TaskManager {
  constructor(storage) {
    this.storage = storage;
    this.tasks = [];
    this.projects = [];
  }
  initialize(initialData) {
    this.tasks = initialData.tasks || [];
    this.projects = initialData.projects || [];
  }
  getTasks() {
    return this.tasks;
  }
  getProjects() {
    return this.projects;
  }
  updateTask(updatedItem, directory, editingIndex, editingType) {
    if (editingIndex !== null) {
      if (editingType === 'Tasks') {
        this.tasks.splice(editingIndex, 1);
      } else {
        this.projects.splice(editingIndex, 1);
      }
      if (directory === 'Tasks') {
        this.tasks.push(updatedItem);
      } else {
        this.projects.push(updatedItem);
      }
      this.saveData();
    }
  }
  updateChecklistItem(directory, taskIndex, checklistIndex, completed) {
    const list = directory === 'Tasks' ? this.tasks : this.projects;
    if (list[taskIndex] && list[taskIndex].checklist[checklistIndex]) {
      list[taskIndex].checklist[checklistIndex].completed = completed;
      this.saveData();
    }
  }
  addItem(newItem, directory) {
    if (directory === 'Tasks') {
      this.tasks.push(newItem);
    } else {
      this.projects.push(newItem);
    }
    this.saveData();
  }
  deleteItem(index, type) {
    if (type === 'Tasks') {
      this.tasks.splice(index, 1);
    } else {
      this.projects.splice(index, 1);
    }
    this.saveData();
  }
  saveData() {
    this.storage.saveData({ tasks: this.tasks, projects: this.projects });
  }
}

/**
 * Manages task and project data operations
 * - Handles CRUD operations for tasks and projects
 * - Maintains data state and persistence through storage
 * - Provides data access methods for UI components
 * Key operations:
 * - Initialize data
 * - Get tasks and projects
 * - Update tasks and checklist items
 * - Add and delete items
 * - Save data through storage
 */
