// src/js/EventHandler.js
import { format, parseISO, isValid } from 'date-fns';
export class EventHandler {
  constructor(todoUI) {
    this.todoUI = todoUI;
    this.editingIndex = null;
    this.editingType = null;
  }
  setupEventListeners() {
    this.setupFormListeners();
    this.setupDateListener();
    this.setupSearchListeners();
    this.setupChecklistListener();
  }
  setupFormListeners() {
    const elements = this.todoUI.elements;
    elements.form.addEventListener('submit', (e) => {
      if (!elements.form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        e.preventDefault();
        const item = {
          text: elements.textInput.value,
          description: elements.textarea.value,
          date: elements.dateInput.value,
          priority: elements.select.value,
          notes: elements.notesInput.value,
          checklist: Array.from(
            elements.checklistContainer.querySelectorAll(
              '.checklist-item input'
            )
          ).map((input) => ({
            text: input.value,
            completed: false,
          })),
        };
        if (this.editingIndex !== null) {
          this.todoUI.updateTask(item);
        } else {
          this.todoUI.addNewItem(item);
        }
        elements.add.setAttribute('data-bs-dismiss', 'modal');
        elements.add.click();
        (() => {
          elements.add.setAttribute('data-bs-dismiss', '');
        })();
      }
      elements.form.classList.add('was-validated');
    });
    elements.form.addEventListener('hidden.bs.modal', () => {
      elements.form.classList.remove('was-validated');
      elements.resetForm();
      this.editingIndex = null;
      this.editingType = null;
    });
  }
  setupDateListener() {
    this.todoUI.elements.dateInput.addEventListener('change', (e) => {
      const date = parseISO(e.target.value);
      if (isValid(date)) {
        e.target.value = format(date, 'yyyy-MM-dd');
      }
    });
  }
  setupSearchListeners() {
    const elements = this.todoUI.elements;
    elements.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.todoUI.searchManager.performSearch(
        elements.searchInput,
        this.todoUI.taskManager.getTasks(),
        this.todoUI.taskManager.getProjects()
      );
    });
    elements.searchInput.addEventListener('input', () => {
      if (elements.searchInput.value.length >= 1) {
        this.todoUI.searchManager.performSearch(
          elements.searchInput,
          this.todoUI.taskManager.getTasks(),
          this.todoUI.taskManager.getProjects()
        );
      } else {
        this.todoUI.searchManager.clearSearch();
      }
    });
  }
  setupChecklistListener() {
    this.todoUI.elements.addChecklistItemBtn.addEventListener('click', () => {
      this.todoUI.checklistManager.addChecklistItemInput(
        this.todoUI.elements.checklistContainer
      );
    });
  }
  editItem(index, type) {
    const elements = this.todoUI.elements;
    const item =
      type === 'Tasks'
        ? this.todoUI.taskManager.getTasks()[index]
        : this.todoUI.taskManager.getProjects()[index];
    elements.textInput.value = item.text;
    elements.dateInput.value = item.date;
    elements.textarea.value = item.description;
    elements.select.value = item.priority;
    elements.directory.value = type;
    elements.notesInput.value = item.notes || '';
    elements.checklistContainer.replaceChildren();
    if (item.checklist) {
      item.checklist.forEach((checkItem) => {
        this.todoUI.checklistManager.addChecklistItemInput(
          elements.checklistContainer,
          checkItem.text
        );
      });
    }
    this.editingIndex = index;
    this.editingType = type;
    elements.modalTitle.textContent = `Edit ${type.slice(0, -1)}`;
    elements.add.textContent = 'Update';
  }
}

/**
 * Manages all event listeners and event-related functionality
 * - Sets up and manages form submissions
 * - Handles date input changes
 * - Manages search functionality
 * - Controls checklist operations
 * - Handles task editing operations
 * Key features:
 * - Form validation
 * - Date formatting
 * - Search functionality
 * - Checklist management
 */
