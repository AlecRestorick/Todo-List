// src/js/DOMElements.js
export class DOMElements {
  constructor() {
    this.form = null;
    this.textInput = null;
    this.dateInput = null;
    this.textarea = null;
    this.select = null;
    this.directory = null;
    this.tasksContainer = null;
    this.projectsContainer = null;
    this.add = null;
    this.modalTitle = null;
    this.searchForm = null;
    this.searchInput = null;
    this.notesInput = null;
    this.checklistContainer = null;
    this.addChecklistItemBtn = null;
  }
  initializeElements() {
    this.form = document.getElementById('form');
    this.textInput = document.getElementById('textInput');
    this.dateInput = document.getElementById('dateInput');
    this.textarea = document.getElementById('textarea');
    this.select = document.getElementById('selectPriority');
    this.directory = document.getElementById('selectDirectory');
    this.tasksContainer = document.getElementById('tasks');
    this.projectsContainer = document.getElementById('projects');
    this.add = document.getElementById('add');
    this.modalTitle = document.getElementById('exampleModalLabel');
    this.searchForm = document.querySelector('form[role="search"]');
    this.searchInput = document.querySelector('input[type="search"]');
    this.notesInput = document.getElementById('notesInput');
    this.checklistContainer = document.getElementById('checklistContainer');
    this.addChecklistItemBtn = document.getElementById('addChecklistItem');
  }
  resetForm() {
    this.textInput.value = '';
    this.dateInput.value = '';
    this.textarea.value = '';
    this.select.value = '';
    this.directory.value = '';
    this.notesInput.value = '';
    this.checklistContainer.replaceChildren();
    this.form.classList.remove('was-validated');
    this.modalTitle.textContent = 'Add New Task';
    this.add.textContent = 'Add';
  }
}

/**
 * Centralizes DOM element references and management
 * - Stores references to all required DOM elements
 * - Provides initialization of DOM element references
 * - Handles form reset functionality
 * Properties:
 * - Various DOM element references (form, inputs, containers, etc.)
 * Methods:
 * - initializeElements(): Sets up all DOM element references
 * - resetForm(): Clears and resets all form inputs
 */
