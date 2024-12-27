
export class TodoUI {
  constructor(storage) {
      this.storage = storage;
      this.data = [];
      this.editingIndex = null;
  }

  initialize(initialData) {
      this.data = initialData;
      this.initializeElements();
      this.setupEventListeners();
      this.createTasks();
  }

  initializeElements() {
      this.form = document.getElementById("form");
      this.textInput = document.getElementById("textInput");
      this.dateInput = document.getElementById("dateInput");
      this.textarea = document.getElementById("textarea");
      this.select = document.getElementById("select");
      this.tasks = document.getElementById("tasks");
      this.add = document.getElementById("add");
      this.modalTitle = document.getElementById("exampleModalLabel");
  }

  setupEventListeners() {
      this.form.addEventListener("submit", (e) => {
          if (!this.form.checkValidity()) {
              e.preventDefault();
              e.stopPropagation();
          } else {
              e.preventDefault();
              this.acceptData();
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

      // Reset validation state and editing state when modal is hidden
      this.form.addEventListener('hidden.bs.modal', () => {
          this.form.classList.remove('was-validated');
          this.resetForm();
          this.editingIndex = null;
          this.modalTitle.textContent = "Add New Task";
          this.add.textContent = "Add";
      });
  }

  updateTask() {
      if (this.editingIndex !== null) {
          this.data[this.editingIndex] = {
              text: this.textInput.value,
              description: this.textarea.value,
              date: this.dateInput.value,
              priority: this.select.value
          };
          this.storage.saveData(this.data);
          this.createTasks();
          this.editingIndex = null;
      }
  }

  acceptData() {
      this.data.push({
          text: this.textInput.value,
          description: this.textarea.value,
          date: this.dateInput.value,
          priority: this.select.value
      });
      this.storage.saveData(this.data);
      this.createTasks();
  }

  editTask(index) {
      const task = this.data[index];
      this.textInput.value = task.text;
      this.dateInput.value = task.date;
      this.textarea.value = task.description;
      this.select.value = task.priority;
      this.editingIndex = index;
      
      // Update UI to indicate editing mode
      this.modalTitle.textContent = "Edit Task";
      this.add.textContent = "Update";
  }

  // Rest of the methods remain the same
  createTasks() {
      this.tasks.replaceChildren();
      this.data.forEach((task, index) => {
          const taskDiv = document.createElement('div');
          taskDiv.id = index;
          taskDiv.className = 'task-item p-3 mb-3 border rounded';

          const taskTitle = document.createElement("h4");
          taskTitle.className = "fw-bold d-block";
          taskTitle.textContent = `Title: ${task.text}`;
          taskDiv.appendChild(taskTitle);

          const taskDate = document.createElement("span");
          taskDate.className = "small text-secondary d-block mt-1";
          taskDate.textContent = `Due Date: ${task.date}`;
          taskDiv.appendChild(taskDate);

          const taskDescription = document.createElement("p");
          taskDescription.className = "my-2";
          taskDescription.textContent = `Description: ${task.description}`;
          taskDiv.appendChild(taskDescription);

          const taskPriority = document.createElement("p");
          taskPriority.className = "my-5";
          taskPriority.textContent = `Priority: ${task.priority}`;
          taskDiv.appendChild(taskPriority);

          const optionSpan = document.createElement("span");
          optionSpan.className = 'options';

          const editIcon = document.createElement('i');
          editIcon.className = "bi bi-pencil-fill me-2";
          editIcon.onclick = () => this.editTask(index);
          editIcon.setAttribute("data-bs-toggle", "modal");
          editIcon.setAttribute("data-bs-target", "#form");
          optionSpan.appendChild(editIcon);

          const deleteIcon = document.createElement("i");
          deleteIcon.className = "bi bi-trash-fill";
          deleteIcon.onclick = () => this.deleteTask(index);
          optionSpan.appendChild(deleteIcon);

          taskDiv.appendChild(optionSpan);
          this.tasks.appendChild(taskDiv);
      });
      this.resetForm();
  }

  deleteTask(index) {
      this.data.splice(index, 1);
      this.storage.saveData(this.data);
      this.createTasks();
  }

  resetForm() {
      this.textInput.value = "";
      this.dateInput.value = "";
      this.textarea.value = "";
      this.select.value = "";
  }
}