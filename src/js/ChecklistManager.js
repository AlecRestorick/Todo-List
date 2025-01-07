// src/js/ChecklistManager.js
export class ChecklistManager {
  addChecklistItemInput(container, initialValue = '') {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'checklist-item input-group mb-2';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.placeholder = 'Checklist item';
    input.required = true;
    input.value = initialValue;
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group-append';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-outline-danger border-2';
    deleteBtn.type = 'button';
    const icon = document.createElement('i');
    icon.className = 'bi bi-trash';
    deleteBtn.appendChild(icon);
    inputGroup.appendChild(deleteBtn);
    itemDiv.appendChild(input);
    itemDiv.appendChild(inputGroup);
    deleteBtn.addEventListener('click', () => itemDiv.remove());
    container.appendChild(itemDiv);
  }
}

/**
 * Manages checklist-related functionality
 * - Creates checklist item inputs
 * - Handles checklist item deletion
 * - Manages checklist UI elements
 * Methods:
 * - addChecklistItemInput(): Creates and adds new checklist input elements
 */
