// src/js/index.js
import { TodoApp } from './TodoApp.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/styles.css';
document.addEventListener('DOMContentLoaded', () => {
  window.todoApp = new TodoApp();
});

/**
 * Entry point of the application
 * - Imports required CSS and JS dependencies
 * - Initializes the TodoApp when DOM is fully loaded
 */
