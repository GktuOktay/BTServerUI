import DepartmentManager from './department-manager.js';

// Merkezi işlemler buradan başlatılır

document.addEventListener('DOMContentLoaded', () => {
    window.departmentManager = new DepartmentManager();
    window.departmentFilters = window.departmentManager.filterManager;
});

// Global fonksiyonlar
export function applyFilters() {
    if (window.departmentManager) {
        window.departmentManager.filterManager.apply();
    }
}

export function resetFilters() {
    if (window.departmentManager) {
        window.departmentManager.filterManager.reset();
    }
}

// Inline HTML'de kullanılabilmesi için fonksiyonları global alana taşı
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
