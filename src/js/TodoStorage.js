// src/js/TodoStorage.js
export class TodoStorage {
    constructor() {
        this.storageKey = 'data';
    }

    loadData() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
}