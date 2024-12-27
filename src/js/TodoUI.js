import { format, parseISO, isValid } from 'date-fns';

export class TodoUI {
    constructor(storage) {
        this.storage = storage;
        this.tasks = [];
        this.projects = [];
        this.editingIndex = null;
        this.editingType = null;
        this.priorityColors = {
            'High': 'border-danger',
            'Medium': 'border-warning',
            'Low': 'border-success'
        };
        this.currentSearchResults = [];
    }

    initialize(initialData) {
        this.tasks = initialData.tasks || [];
        this.projects = initialData.projects || [];
        this.initializeElements();
        this.setupEventListeners();
        this.createTasks();
        this.createProjects();
    }

    initializeElements() {
        this.form = document.getElementById("form");
        this.textInput = document.getElementById("textInput");
        this.dateInput = document.getElementById("dateInput");
        this.textarea = document.getElementById("textarea");
        this.select = document.getElementById("selectPriority");
        this.directory = document.getElementById("selectDirectory");
        this.tasksContainer = document.getElementById("tasks");
        this.projectsContainer = document.getElementById("projects");
        this.add = document.getElementById("add");
        this.modalTitle = document.getElementById("exampleModalLabel");
        this.searchForm = document.querySelector('form[role="search"]');
        this.searchInput = document.querySelector('input[type="search"]');
        this.notesInput = document.getElementById("notesInput");
        this.checklistContainer = document.getElementById("checklistContainer");
        this.addChecklistItemBtn = document.getElementById("addChecklistItem");
    }

    formatDate(dateString) {
        const date = parseISO(dateString);
        return isValid(date) ? format(date, 'MMM d, yyyy') : dateString;
    }

    setupEventListeners() {
        this.form.addEventListener("submit", (e) => {
            if (!this.form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                e.preventDefault();
                if (this.editingIndex !== null) {
                    this.updateTask();
                } else {
                    this.acceptData();
                }
                this.add.setAttribute('data-bs-dismiss', 'modal');
                this.add.click();
                (() => {
                    this.add.setAttribute("data-bs-dismiss", "");
                })();
            }
            this.form.classList.add('was-validated');
        });

        this.form.addEventListener('hidden.bs.modal', () => {
            this.form.classList.remove('was-validated');
            this.resetForm();
            this.editingIndex = null;
            this.modalTitle.textContent = "Add New Task";
            this.add.textContent = "Add";
        });

        this.dateInput.addEventListener('change', (e) => {
            const date = parseISO(e.target.value);
            if (isValid(date)) {
                e.target.value = format(date, 'yyyy-MM-dd');
            }
        });

        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch();
        });

        this.searchInput.addEventListener('input', () => {
            if (this.searchInput.value.length >= 1) {
                this.performSearch();
            } else {
                this.clearSearch();
            }
        });

        this.addChecklistItemBtn.addEventListener('click', () => {
            this.addChecklistItemInput();
        });
    }


    addChecklistItemInput() {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'checklist-item input-group mb-2';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.placeholder = 'Checklist item';
        input.required = true;

        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group-append';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-outline-danger border-2'
        deleteBtn.type = 'button'
        const icon = document.createElement('i');
        icon.className = 'bi bi-trash';
        deleteBtn.appendChild(icon);

        inputGroup.appendChild(deleteBtn);
        itemDiv.appendChild(input);
        itemDiv.appendChild(inputGroup);

        deleteBtn.addEventListener('click', () => itemDiv.remove());

        this.checklistContainer.appendChild(itemDiv);
    }

    performSearch() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        if (!searchTerm) {
            this.clearSearch();
            return;
        }

        this.clearSearch();

        this.searchInArray(this.tasks, 'tasks');
        this.searchInArray(this.projects, 'projects');

        if (this.currentSearchResults.length > 0) {
            this.currentSearchResults[0].element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    searchInArray(array, type) {
        array.forEach((item, index) => {
            const itemId = `${type}-${index}`;
            const element = document.getElementById(itemId);
            
            if (!element) return;

            const searchableContent = `
                ${item.text.toLowerCase()}
                ${item.description.toLowerCase()}
                ${item.date}
                ${item.priority.toLowerCase()}
            `;

            if (searchableContent.includes(this.searchInput.value.toLowerCase())) {
                element.classList.add('search-highlight');
                this.currentSearchResults.push({
                    element,
                    type,
                    index
                });
            }
        });
    }

    clearSearch() {
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.classList.remove('search-highlight');
        });
        this.currentSearchResults = [];
    }

    updateTask() {
        if (this.editingIndex !== null) {
            const updatedItem = {
                text: this.textInput.value,
                description: this.textarea.value,
                date: this.dateInput.value,
                priority: this.select.value,
                notes: this.notesInput.value,
                checklist: Array.from(this.checklistContainer.querySelectorAll('.checklist-item input'))
                    .map(input => ({
                        text: input.value,
                        completed: false
                    }))
            };

            if (this.editingType === 'Tasks') {
                this.tasks.splice(this.editingIndex, 1);
            } else {
                this.projects.splice(this.editingIndex, 1);
            }
            
            if (this.directory.value === 'Tasks') {
                this.tasks.push(updatedItem);
            } else {
                this.projects.push(updatedItem);
            }
    
            this.storage.saveData({ tasks: this.tasks, projects: this.projects });
            this.createTasks();
            this.createProjects();
            this.editingIndex = null;
            this.editingType = null;
        }
    }

    acceptData() {
        const newItem = {
            text: this.textInput.value,
            description: this.textarea.value,
            date: this.dateInput.value,
            priority: this.select.value,
            notes: this.notesInput.value,
            checklist: Array.from(this.checklistContainer.querySelectorAll('.checklist-item input'))
                .map(input => ({
                    text: input.value,
                    completed: false
                })),
        };

        if (this.directory.value === 'Tasks') {
            this.tasks.push(newItem);
        } else {
            this.projects.push(newItem);
        }

        this.storage.saveData({ tasks: this.tasks, projects: this.projects });
        this.createTasks();
        this.createProjects();
    }

    createTasks() {
        this.createItems(this.tasks, this.tasksContainer);
    }

    createProjects() {
        this.createItems(this.projects, this.projectsContainer);
    }

    createItems(items, container) {
        container.replaceChildren();
        items.forEach((item, index) => {
            const itemDiv = this.createItemElement(item, index, container.id);
            container.appendChild(itemDiv);
        });
    }

    createItemElement(item, index, containerId) {
// Task Div
        const div = document.createElement('div');
        div.id = `${containerId}-${index}`;
        div.className = `task-item p-3 my-3 mx-2 border border-2 rounded ${this.priorityColors[item.priority]}`;
// Title
        const title = document.createElement("h5");
        title.className = "d-block my-3";
        title.textContent = `Title:`;
        const titleName = document.createElement("p");
        titleName.className = 'text-muted mx-3';
        titleName.textContent = `${item.text}`;
        div.appendChild(title);
        div.appendChild(titleName);
// Description
        const description = document.createElement("h5");
        description.className = "d-block my-3";
        description.textContent = `Description:`;
        const descriptionDetail = document.createElement("p");
        descriptionDetail.className = 'text-muted mx-3';
        descriptionDetail.textContent = `${item.description}`
        div.appendChild(description);
        div.appendChild(descriptionDetail);
// Due Date
        const date = document.createElement("h5");
        date.className = "d-block my-3";
        date.textContent = `Due Date:`;
        const dateFormat = document.createElement("p");
        dateFormat.className = 'text-muted mx-3';
        dateFormat.textContent = `${this.formatDate(item.date)}`;
        div.appendChild(date);
        div.appendChild(dateFormat);
// Notes
        const notes = document.createElement("div");
        notes.className = "my-3";
        const headingNotes = document.createElement('h5');
        headingNotes.className = 'd-block my-3';
        headingNotes.textContent = 'Notes:';
        const paragraph = document.createElement('p');
        paragraph.className = 'text-muted mx-3';
        paragraph.textContent = `${item.notes}`;
        notes.appendChild(headingNotes);
        notes.appendChild(paragraph);
        div.appendChild(notes);

// Checklist
        const checklistDiv = document.createElement("div");
        checklistDiv.className = "my-3";
        const headingChecklist = document.createElement('h5');
        headingChecklist.className = 'd-block my-2';
        headingChecklist.textContent = 'Checklist:';
        checklistDiv.appendChild(headingChecklist);
        const list = document.createElement("ul");
        list.className = "list-group";
        item.checklist.forEach((checkItem, checkIndex) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center text-muted";
            const formCheck = document.createElement('div');
            formCheck.className = 'form-check';
            const checkbox = document.createElement('input');
            checkbox.className = 'form-check-input';
            checkbox.type = 'checkbox';
            checkbox.id = `check-${containerId}-${index}-${checkIndex}`;
            checkbox.checked = checkItem.completed;
            const label = document.createElement("label");
            label.className = `form-check-label ${checkItem.completed ? 'text-decoration-line-through' : ''}`;
            label.htmlFor = `check-${containerId}-${index}-${checkIndex}`;
            label.textContent = `${checkItem.text}`;
            formCheck.appendChild(checkbox);
            formCheck.appendChild(label);
            listItem.appendChild(formCheck);

            checkbox.addEventListener('change', (e) => {
                const label = listItem.querySelector('label');
                checkItem.completed = e.target.checked;
                label.classList.toggle('text-decoration-line-through', e.target.checked);
                this.storage.saveData({ tasks: this.tasks, projects: this.projects });
            });
            list.appendChild(listItem);
        });
        checklistDiv.appendChild(list);
        div.appendChild(checklistDiv);

//Priority Level
        const priority = document.createElement("h5");
        priority.className = `badge ${this.priorityColors[item.priority]?.replace('border-', 'bg-')} my-3 d-block my-2 fw-bold`;
        priority.textContent = `Priority Level: ${item.priority}`;
        div.appendChild(priority);

//Buttons
        const buttons = this.createButtons(index, containerId === 'tasks' ? 'Tasks' : 'Projects');
        div.appendChild(buttons);

        return div;
    }

    createButtons(index, type) {
        const span = document.createElement("span");
        span.className = 'options';

        const btnGroup = document.createElement("div");
        btnGroup.className = 'btn-group';
        btnGroup.setAttribute("role", "group");

        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-outline-success border-2";
        editBtn.textContent = "Edit  ";
        editBtn.onclick = () => this.editItem(index, type);
        editBtn.setAttribute("data-bs-toggle", "modal");
        editBtn.setAttribute("data-bs-target", "#form");
        editBtn.appendChild(this.createIcon("bi-pencil-fill me-2"));

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-outline-danger border-2";
        deleteBtn.textContent = "Delete  ";
        deleteBtn.onclick = () => this.deleteItem(index, type);
        deleteBtn.appendChild(this.createIcon("bi-trash-fill"));

        btnGroup.append(editBtn, deleteBtn);
        span.appendChild(btnGroup);
        return span;
    }

    createIcon(className) {
        const icon = document.createElement("i");
        icon.className = `bi ${className}`;
        return icon;
    }

    editItem(index, type) {
        const item = type === 'Tasks' ? this.tasks[index] : this.projects[index];
        this.textInput.value = item.text;
        this.dateInput.value = item.date;
        this.textarea.value = item.description;
        this.select.value = item.priority;
        this.directory.value = type;
        this.editingIndex = index;
        this.editingType = type;
        this.modalTitle.textContent = `Edit ${type.slice(0, -1)}`;
        this.add.textContent = "Update";
        this.notesInput.value = item.notes || '';
        
        this.checklistContainer.replaceChildren();
        
        if (item.checklist) {
            item.checklist.forEach(checkItem => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'checklist-item input-group mb-2';
                const input = document.createElement("input");
                input.type = 'text';
                input.className = 'form-control';
                input.value = `${checkItem.text}`;
                input.required = true;
                const inputGroup = document.createElement('div');
                inputGroup.className = 'input-group-append';
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-outline-danger';
                deleteBtn.type = 'button';
                const icon = document.createElement('i');
                icon.className = 'bi bi-trash';
                deleteBtn.appendChild(icon);
                inputGroup.appendChild(deleteBtn);
                itemDiv.appendChild(input);
                itemDiv.appendChild(inputGroup);
                deleteBtn.addEventListener('click', () => itemDiv.remove());
                this.checklistContainer.appendChild(itemDiv);
            });
        }
        
    }

    deleteItem(index, type) {
        if (type === 'Tasks') {
            this.tasks.splice(index, 1);
        } else {
            this.projects.splice(index, 1);
        }
        this.storage.saveData({ tasks: this.tasks, projects: this.projects });
        this.createTasks();
        this.createProjects();
    }

    resetForm() {
        // Reset all form inputs
        this.textInput.value = "";
        this.dateInput.value = "";
        this.textarea.value = "";
        this.select.value = "";
        this.directory.value = "";  // Reset directory selection
        this.notesInput.value = ""; // Reset notes
        
        // Clear all checklist items
        this.checklistContainer.replaceChildren();
        
        // Reset form validation state
        this.form.classList.remove('was-validated');
        
        // Reset modal title and add button text
        this.modalTitle.textContent = "Add New Task";
        this.add.textContent = "Add";
        
        // Reset editing state
        this.editingIndex = null;
        this.editingType = null;
    }
}