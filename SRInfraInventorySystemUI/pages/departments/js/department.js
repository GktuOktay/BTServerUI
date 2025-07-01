import DepartmentManager from './department-manager.js';

// Merkezi işlemler buradan başlatılır

document.addEventListener('DOMContentLoaded', () => {
    window.departmentManager = new DepartmentManager();
});

// Global fonksiyonlar
export function applyFilters() {
    if (window.departmentManager) {
        window.departmentManager.applyFilters();
    }
}

export function resetFilters() {
    if (window.departmentManager) {
        window.departmentManager.resetFilters();
    }
}
