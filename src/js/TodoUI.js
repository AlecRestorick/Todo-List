// src/js/TodoUI.js
import { DOMElements } from './DOMElements.js';
import { TaskRenderer } from './TaskRenderer.js';
import { EventHandler } from './EventHandler.js';
import { SearchManager } from './SearchManager.js';
import { ChecklistManager } from './ChecklistManager.js';
import { TaskManager } from './TaskManager.js';
export class TodoUI {
  constructor(storage) {
    this.storage = storage;
    this.taskManager = new TaskManager(storage);
    this.elements = new DOMElements();
    this.taskRenderer = new TaskRenderer(this);
    this.searchManager = new SearchManager();
    this.checklistManager = new ChecklistManager();
    this.eventHandler = new EventHandler(this);
  }
  initialize(initialData) {
    this.taskManager.initialize(initialData);
    this.elements.initializeElements();
    this.eventHandler.setupEventListeners();
    this.createTasks();
    this.createProjects();
  }
  createTasks() {
    this.taskRenderer.createItems(
      this.taskManager.getTasks(),
      this.elements.tasksContainer,
      'tasks'
    );
  }
  createProjects() {
    this.taskRenderer.createItems(
      this.taskManager.getProjects(),
      this.elements.projectsContainer,
      'projects'
    );
  }
  updateTask(updatedItem) {
    this.taskManager.updateTask(
      updatedItem,
      this.elements.directory.value,
      this.eventHandler.editingIndex,
      this.eventHandler.editingType
    );
    this.createTasks();
    this.createProjects();
  }
  addNewItem(newItem) {
    this.taskManager.addItem(newItem, this.elements.directory.value);
    this.createTasks();
    this.createProjects();
  }
  deleteItem(index, type) {
    this.taskManager.deleteItem(index, type);
    this.createTasks();
    this.createProjects();
  }
}

/**
 * Manages all UI-related operations and components
 * - Coordinates between different UI managers (TaskRenderer, SearchManager, etc.)
 * - Handles UI initialization and updates
 * - Manages interaction between UI components and data layer
 * Key responsibilities:
 * - Initializes UI components and event handlers
 * - Creates and updates task and project displays
 * - Manages task updates and deletions
 */
