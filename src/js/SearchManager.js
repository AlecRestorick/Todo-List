// src/js/SearchManager.js
export class SearchManager {
  constructor() {
    this.currentSearchResults = [];
  }
  performSearch(searchInput, tasks, projects) {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) {
      this.clearSearch();
      return;
    }
    this.clearSearch();
    this.searchInArray(tasks, 'tasks', searchTerm);
    this.searchInArray(projects, 'projects', searchTerm);
    if (this.currentSearchResults.length > 0) {
      this.currentSearchResults[0].element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }
  searchInArray(array, type, searchTerm) {
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
      if (searchableContent.includes(searchTerm)) {
        element.classList.add('search-highlight');
        this.currentSearchResults.push({
          element,
          type,
          index,
        });
      }
    });
  }
  clearSearch() {
    document.querySelectorAll('.search-highlight').forEach((el) => {
      el.classList.remove('search-highlight');
    });
    this.currentSearchResults = [];
  }
}

/**
 * Handles search functionality across tasks and projects
 * - Performs search operations
 * - Manages search results highlighting
 * - Controls search result display
 * Key features:
 * - Search within tasks and projects
 * - Highlight matching results
 * - Clear search results
 * - Scroll to search results
 */
