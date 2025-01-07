// src/js/TodoApp.js
import { TodoUI } from './TodoUI.js';
import { TodoStorage } from './TodoStorage.js';
export class TodoApp {
  constructor() {
    this.storage = new TodoStorage();
    this.ui = new TodoUI(this.storage);
    this.data = [];
    this.initializeApp();
  }
  initializeApp() {
    this.data = this.storage.loadData();
    this.ui.initialize(this.data);
  }
}

/**
 * Main application class that orchestrates the Todo application
 * - Manages storage and UI initialization
 * - Serves as the central point of coordination between storage and UI components
 * - Maintains the application's data state
 */
