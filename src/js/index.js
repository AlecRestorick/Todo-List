// src/js/main.js
import { TodoApp } from './TodoApp.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/styles.css';

document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});