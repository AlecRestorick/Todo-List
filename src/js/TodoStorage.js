// src/js/TodoStorage.js
export class TodoStorage {
  constructor() {
    this.storageKey = 'data';
  }
  loadData() {
    return (
      JSON.parse(localStorage.getItem(this.storageKey)) || {
        tasks: [],
        projects: [],
      }
    );
  }
  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}

/**
 * Handles data persistence using localStorage
 * - Manages saving and loading of todo items and projects
 * - Provides data storage interface for the application
 * - Uses 'data' as the storage key in localStorage
 * Methods:
 * - loadData(): Retrieves stored data or returns default empty structure
 * - saveData(data): Persists data to localStorage
 */
