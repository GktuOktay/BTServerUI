// Toastr progressBar ayarı
if (window.toastr) {
    toastr.options.progressBar = true;
}

// Caret yanıp sönme sorunu için CSS
document.addEventListener('DOMContentLoaded', function() {
    // Caret yanıp sönme sorununu çöz
    const style = document.createElement('style');
    style.textContent = `
        body *:not(input):not(textarea):not([contenteditable="true"]) {
            caret-color: transparent !important;
        }
    `;
    document.head.appendChild(style);
});

// Filtre modalındaki tüm filtreler için event listener
$('#filter-status-card, #filter-parent-card, #filter-name-card, #page-size-select').on('change input', function() {
    if (!window.departmentManager) return;
    // Departman adı
    window.departmentManager.filters.name = $('#filter-name-card').val() || null;
    // Durum
    const statusVal = $('#filter-status-card').val();
    window.departmentManager.filters.isActive = statusVal === '' ? null : (statusVal === 'true');
    // Üst departman
    const parentVal = $('#filter-parent-card').val();
    window.departmentManager.filters.parentDepartmentId = parentVal === '' ? null : parentVal;
    // Sayfa boyutu
    const pageSizeVal = $('#page-size-select').val();
    if (pageSizeVal) {
        window.departmentManager.pageSize = parseInt(pageSizeVal, 10);
    }
    window.departmentManager.currentPage = 1;
    window.departmentManager.loadDepartments();
});

// Filtre butonuna tıklandığında üst departmanları yükle
$(document).on('click', '[data-kt-menu-trigger="click"]', function() {
    if (window.departmentManager && this.textContent.includes('Filtrele')) {
        // Filtre modalı açıldığında üst departmanları yükle
        setTimeout(() => {
            if (window.departmentManager) {
                window.departmentManager.loadParentDepartmentsForFilter();
            }
        }, 100);
    }
});

// Filtreleri temizle
function resetFilters() {
    if (!window.departmentManager) return;
    
    // Form alanlarını temizle
    $('#filter-name-card').val('');
    $('#filter-status-card').val('');
    $('#filter-parent-card').val('');
    $('#page-size-select').val('10');
    
    // Filtreleri sıfırla
    window.departmentManager.filters = {
        name: null,
        isActive: null,
        parentDepartmentId: null
    };
    
    // Sayfa boyutunu sıfırla
    window.departmentManager.pageSize = 10;
    window.departmentManager.currentPage = 1;
    
    // Tabloyu yenile
    window.departmentManager.loadDepartments();
}

// Filtreleri uygula
function applyFilters() {
    if (!window.departmentManager) return;
    
    // Filtreleri güncelle
    window.departmentManager.filters.name = $('#filter-name-card').val() || null;
    
    const statusVal = $('#filter-status-card').val();
    window.departmentManager.filters.isActive = statusVal === '' ? null : (statusVal === 'true');
    
    const parentVal = $('#filter-parent-card').val();
    window.departmentManager.filters.parentDepartmentId = parentVal === '' ? null : parentVal;
    
    const pageSizeVal = $('#page-size-select').val();
    if (pageSizeVal) {
        window.departmentManager.pageSize = parseInt(pageSizeVal, 10);
    }
    
    window.departmentManager.currentPage = 1;
    window.departmentManager.loadDepartments();
}

// Page size select2 başlat (isteğe bağlı, klasik select ile de çalışır)
$(function() {
    if (window.jQuery && $('#page-size-select').length) {
        $('#page-size-select').select2({
            minimumResultsForSearch: Infinity,
            width: 'style',
            dropdownParent: $('#page-size-select').parent()
        });
    }
});

// Page size değişim event
$('#page-size-select').on('change', function() {
    if (window.departmentManager) {
        window.departmentManager.pageSize = parseInt(this.value, 10);
        window.departmentManager.currentPage = 1;
        window.departmentManager.loadDepartments();
    }
}); 