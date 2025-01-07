// src/js/TaskRenderer.js
import { DateFormatter } from './DateFormatter.js';
export class TaskRenderer {
  constructor(todoApp) {
    this.todoApp = todoApp;
    this.priorityColors = {
      High: 'border-danger',
      Medium: 'border-warning',
      Low: 'border-success',
    };
    this.dateFormatter = new DateFormatter();
  }
  createItems(items, container, containerId) {
    container.replaceChildren();
    items.forEach((item, index) => {
      const itemDiv = this.createItemElement(item, index, containerId);
      container.appendChild(itemDiv);
    });
  }
  createItemElement(item, index, containerId) {
    const div = document.createElement('div');
    div.id = `${containerId}-${index}`;
    div.className = `task-item p-3 my-3 mx-2 border border-2 rounded ${
      this.priorityColors[item.priority]
    }`;
    div.appendChild(this.createSection('Title', item.text));
    div.appendChild(this.createSection('Description', item.description));
    div.appendChild(
      this.createSection('Due Date', this.dateFormatter.formatDate(item.date))
    );
    div.appendChild(this.createSection('Notes', item.notes));
    div.appendChild(
      this.createChecklistSection(item.checklist, containerId, index)
    );
    div.appendChild(this.createPriorityBadge(item.priority));
    div.appendChild(
      this.createButtons(index, containerId === 'tasks' ? 'Tasks' : 'Projects')
    );
    return div;
  }
  createSection(title, content) {
    const section = document.createElement('div');
    const heading = document.createElement('h5');
    heading.className = 'd-block my-3';
    heading.textContent = `${title}:`;
    const text = document.createElement('p');
    text.className = 'text-muted mx-3';
    text.textContent = content;
    section.appendChild(heading);
    section.appendChild(text);
    return section;
  }
  createChecklistSection(checklist, containerId, index) {
    const checklistDiv = document.createElement('div');
    checklistDiv.className = 'my-3';
    const heading = document.createElement('h5');
    heading.className = 'd-block my-2';
    heading.textContent = 'Checklist:';
    checklistDiv.appendChild(heading);
    const list = document.createElement('ul');
    list.className = 'list-group';
    checklist.forEach((checkItem, checkIndex) => {
      list.appendChild(
        this.createChecklistItem(checkItem, containerId, index, checkIndex)
      );
    });
    checklistDiv.appendChild(list);
    return checklistDiv;
  }
  createChecklistItem(checkItem, containerId, index, checkIndex) {
    const listItem = document.createElement('li');
    listItem.className =
      'list-group-item d-flex justify-content-between align-items-center text-muted';
    const formCheck = document.createElement('div');
    formCheck.className = 'form-check';
    const checkbox = document.createElement('input');
    checkbox.className = 'form-check-input';
    checkbox.type = 'checkbox';
    checkbox.id = `check-${containerId}-${index}-${checkIndex}`;
    checkbox.checked = checkItem.completed;
    checkbox.addEventListener('change', (e) => {
      const label = e.target.nextElementSibling;
      label.classList.toggle('text-decoration-line-through', e.target.checked);
      const taskList =
        containerId === 'tasks'
          ? this.todoApp.taskManager.getTasks()
          : this.todoApp.taskManager.getProjects();
      taskList[index].checklist[checkIndex].completed = e.target.checked;
      this.todoApp.taskManager.saveData();
    });
    const label = document.createElement('label');
    label.className = 'form-check-label';
    if (checkItem.completed) {
      label.classList.add('text-decoration-line-through');
    }
    label.htmlFor = checkbox.id;
    label.textContent = checkItem.text;
    formCheck.appendChild(checkbox);
    formCheck.appendChild(label);
    listItem.appendChild(formCheck);
    return listItem;
  }
  createPriorityBadge(priority) {
    const badge = document.createElement('h5');
    badge.className = `badge ${this.priorityColors[priority]?.replace(
      'border-',
      'bg-'
    )} my-3 d-block my-2 fw-bold`;
    badge.textContent = `Priority Level: ${priority}`;
    return badge;
  }
  createButtons(index, type) {
    const span = document.createElement('span');
    span.className = 'options';
    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';
    btnGroup.setAttribute('role', 'group');
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-outline-success border-2';
    editBtn.textContent = 'Edit  ';
    editBtn.setAttribute('data-bs-toggle', 'modal');
    editBtn.setAttribute('data-bs-target', '#form');
    editBtn.appendChild(this.createIcon('bi-pencil-fill me-2'));
    editBtn.onclick = () =>
      window.todoApp.ui.eventHandler.editItem(index, type);
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-outline-danger border-2';
    deleteBtn.textContent = 'Delete  ';
    deleteBtn.appendChild(this.createIcon('bi-trash-fill'));
    deleteBtn.onclick = () => window.todoApp.ui.deleteItem(index, type);
    btnGroup.append(editBtn, deleteBtn);
    span.appendChild(btnGroup);
    return span;
  }
  createIcon(className) {
    const icon = document.createElement('i');
    icon.className = `bi ${className}`;
    return icon;
  }
}

/**
 * Handles the rendering of tasks and projects in the UI
 * - Creates HTML elements for tasks and projects
 * - Manages the visual representation of items
 * - Handles priority colors and styling
 * Key components:
 * - Item creation and rendering
 * - Section creation (title, description, date, etc.)
 * - Checklist rendering
 * - Priority badge creation
 * - Button creation for actions
 *
 * HTML Structure created:
 * <div class="task-item">
 *   <div>[Title Section]</div>
 *   <div>[Description Section]</div>
 *   <div>[Due Date Section]</div>
 *   <div>[Notes Section]</div>
 *   <div>[Checklist Section]</div>
 *   <h5>[Priority Badge]</h5>
 *   <span>[Action Buttons]</span>
 * </div>
 */
