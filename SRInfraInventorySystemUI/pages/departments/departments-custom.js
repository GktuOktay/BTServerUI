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

// Select2 Style Functionality
class Select2Style {
    constructor(wrapper) {
        this.wrapper = wrapper;
        this.select = wrapper.querySelector('select');
        this.selection = wrapper.querySelector('.select2-selection');
        this.dropdown = wrapper.querySelector('.select2-dropdown');
        this.options = wrapper.querySelectorAll('.select2-option');
        this.isOpen = false;
        this.init();
    }
    
    init() {
        // Selection click event
        this.selection.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        
        // Option click events
        this.options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectOption(option);
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.close();
            }
        });
        
        // Keyboard support
        this.wrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            } else if (e.key === 'Escape') {
                this.close();
            }
        });
        
        // Make wrapper focusable
        this.wrapper.setAttribute('tabindex', '0');
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.wrapper.classList.add('select2-open');
        this.wrapper.classList.add('select2-focused');
        this.isOpen = true;
    }
    
    close() {
        this.wrapper.classList.remove('select2-open');
        this.wrapper.classList.remove('select2-focused');
        this.isOpen = false;
    }
    
    selectOption(option) {
        const value = option.getAttribute('data-value');
        const text = option.textContent;
        
        // Update hidden select
        this.select.value = value;
        
        // Update selection display
        this.selection.textContent = text;
        
        // Update option states
        this.options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        this.select.dispatchEvent(event);
        
        this.close();
    }
    
    updateOptions(newOptions) {
        // Clear existing options
        this.dropdown.innerHTML = '';
        
        // Add new options
        newOptions.forEach(opt => {
            const optionEl = document.createElement('div');
            optionEl.className = 'select2-option';
            optionEl.setAttribute('data-value', opt.value);
            optionEl.textContent = opt.text;
            
            optionEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectOption(optionEl);
            });
            
            this.dropdown.appendChild(optionEl);
        });
        
        // Update options reference
        this.options = this.dropdown.querySelectorAll('.select2-option');
        
        // Auto-select first option if current selection is empty or not found
        const currentValue = this.select.value;
        const currentOption = this.dropdown.querySelector(`[data-value="${currentValue}"]`);
        
        if (!currentOption && newOptions.length > 0) {
            // Select first option
            const firstOption = this.dropdown.querySelector('.select2-option');
            if (firstOption) {
                this.selectOption(firstOption);
            }
        } else if (currentOption) {
            // Update selection display for current value
            this.selection.textContent = currentOption.textContent;
            currentOption.classList.add('selected');
        }
    }
    
    setValue(value) {
        const option = this.dropdown.querySelector(`[data-value="${value}"]`);
        if (option) {
            this.selectOption(option);
        }
    }
    
    getValue() {
        return this.select.value;
    }
}

// Initialize Select2 Style components
document.addEventListener('DOMContentLoaded', function() {
    const select2Wrappers = document.querySelectorAll('.select2-style');
    const select2Instances = {};
    
    select2Wrappers.forEach(wrapper => {
        const instance = new Select2Style(wrapper);
        select2Instances[wrapper.id] = instance;
    });
    
    // Make instances globally accessible
    window.select2Instances = select2Instances;
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

// Page size select2 başlat
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