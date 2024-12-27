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