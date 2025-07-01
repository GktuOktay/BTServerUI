"use strict";
import { createDepartment } from './department-create.js';
import DepartmentFilters from './department-filters.js';

// TOASTR ENTEGRASYONU (sayfanın başında veya uygun bir yerde, bir kere eklenmeli)
// Eğer zaten ekli değilse, aşağıdaki satırları list.html dosyasına <head> veya <body> sonuna ekleyin:
// <link rel="stylesheet" href="../../assets/plugins/toastr/toastr.min.css">
// <script src="../../assets/plugins/toastr/toastr.min.js"></script>

// Departman Yönetimi Sınıfı
export default class DepartmentManager {
    constructor() {
        this.currentPage = 1;
        this.pageSize = window.APIConfig.DEFAULT_PAGE_SIZE;
        this.totalRecords = 0;
        
        // Filtre yöneticisi
        this.filters = {
            name: null,
            isActive: null,
            parentDepartmentId: null
        };
        this.filterManager = new DepartmentFilters(this);

        this.init();
    }

    init() {
        this.loadDepartments();
        this.initEventListeners();
        this.loadParentDepartments();
    }

    initEventListeners() {


        // Yeni departman formu
        const newDepartmentForm = document.getElementById('new_department_form');
        if (newDepartmentForm) {
            newDepartmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                createDepartment(newDepartmentForm, this);
            });
        }

        // Modal kapanma butonları
        const closeButtons = document.querySelectorAll('[data-kt-users-modal-action="close"], [data-kt-users-modal-action="cancel"]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });
        
        // Modal açıldığında parent departments yükle
        const modal = document.getElementById('kt_modal_new_department');
        if (modal) {
            modal.addEventListener('shown.bs.modal', () => {
                this.loadParentDepartments();
            });
        }
    }

    // API'den departmanları yükle
    async loadDepartments() {
        try {
            const params = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            };
            if (this.filters.name) params.name = this.filters.name;
            if (this.filters.isActive !== null) params.isActive = this.filters.isActive;
            if (this.filters.parentDepartmentId !== null) params.parentDepartmentId = this.filters.parentDepartmentId;

            const result = await DepartmentAPI.getDepartments(params);
            const responseData = result.data || result;
            const departments = responseData.data || [];
            const totalCount = responseData.totalCount || departments.length;
            const totalPages = responseData.totalPages || Math.ceil(totalCount / this.pageSize);

            this.totalRecords = totalCount;
            this.renderTable(departments);
            this.updateDepartmentCount(totalCount);
            this.updatePagination(totalPages, this.currentPage);
        } catch (error) {
            console.error('Departman yükleme hatası:', error);
            this.showConnectionError();
        }
    }

    // Bağlantı hatası göster
    showConnectionError() {
        const tableContainer = document.getElementById('table-container');
        const paginationContainer = document.getElementById('pagination-container');
        
        if (tableContainer) {
            tableContainer.innerHTML = `
                <div class="d-flex flex-column align-items-center justify-content-center py-10">
                    <div class="text-center">
                        <div class="mb-5">
                            <i class="fas fa-exclamation-triangle fa-3x text-warning"></i>
                        </div>
                        <h3 class="text-gray-800 fw-bold mb-2">Bağlantı Sırasında Hata Oluştu</h3>
                        <p class="text-gray-600 fs-6 mb-5">API sunucusuna bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.</p>
                        <button class="btn btn-primary" onclick="window.location.reload()">
                            <i class="fas fa-redo-alt me-2"></i>Tekrar Dene
                        </button>
                    </div>
                </div>
            `;
            tableContainer.style.display = 'block';
        }
        
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
        
        this.updateDepartmentCount(0);
    }

    // Veri yok mesajı göster
    showNoData() {
        const tableContainer = document.getElementById('table-container');
        const paginationContainer = document.getElementById('pagination-container');
        
        if (tableContainer) {
            tableContainer.innerHTML = `
                <div class="d-flex flex-column align-items-center justify-content-center py-10">
                    <div class="text-center">
                        <div class="mb-5">
                            <i class="fas fa-inbox fa-3x text-muted"></i>
                        </div>
                        <h3 class="text-gray-800 fw-bold mb-2">Kayıtlı departman bulunmamaktadır</h3>
                        <p class="text-gray-600 fs-6 mb-5">Henüz hiç departman kaydı bulunmuyor.</p>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_new_department">
                            <i class="fas fa-plus me-2"></i>İlk Departmanı Ekle
                        </button>
                    </div>
                </div>
            `;
            tableContainer.style.display = 'block';
        }
        
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
        
        this.updateDepartmentCount(0);
    }

    // Tabloyu render et
    renderTable(departments) {
        const tableBody = document.getElementById('departments-table-body');
        const tableContainer = document.getElementById('table-container');
        const paginationContainer = document.getElementById('pagination-container');
        
        if (!tableBody || !tableContainer) {
            return;
        }
        
        if (!departments || departments.length === 0) {
            this.showNoData();
            return;
        }
        
        const tableContent = departments.map((dept, index) => {
            const rowNumber = (this.currentPage - 1) * this.pageSize + index + 1;
            const statusBadge = dept.isActive 
                ? '<span class="badge badge-light-success">Aktif</span>'
                : '<span class="badge badge-light-danger">Pasif</span>';
            
            // Üst kategori bilgisini al
            const parentDepartmentName = dept.parentDepartmentName || 'Ana departman';
            
            // Açıklama ve yönetici için boş değer kontrolü
            const description = dept.description || '-';
            const manager = dept.managerPersonnelName || '-';
            
            return `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="symbol symbol-45px me-5">
                                <div class="symbol-label bg-light-primary">
                                    <i class="fas fa-building text-primary fs-3"></i>
                                </div>
                            </div>
                            <div class="d-flex justify-content-start flex-column">
                                <a href="#" class="text-dark fw-bold text-hover-primary fs-6">${dept.name}</a>
                                <span class="text-muted fw-semibold text-muted d-block fs-7">${statusBadge} ${parentDepartmentName}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="text-dark text-hover-primary fs-6">${description}</span>
                    </td>
                    <td>
                        <span class="text-muted fw-semibold text-muted fs-7">${manager}</span>
                    </td>
                    <td class="text-center">
                        <span class="badge badge-light-info">${dept.personnelCount}</span>
                    </td>
                    <td class="text-center">
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-sm btn-light-warning" onclick="departmentManager.editDepartment('${dept.id}')" title="Düzenle">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-light-danger" onclick="departmentManager.deleteDepartment('${dept.id}', '${dept.name}')" title="Sil">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        tableBody.innerHTML = tableContent;
        tableContainer.style.display = 'block';
        paginationContainer.style.display = 'block';
    }

    // Departman sayısını güncelle
    updateDepartmentCount(count) {
        const countElement = document.getElementById('department-count');
        if (countElement) {
            countElement.textContent = `Toplam: ${count} departman`;
        }
    }

    // Pagination güncelle
    updatePagination(totalPages = 1, currentPage = 1) {
        const paginationList = document.getElementById('pagination-list');
        const paginationInfo = document.getElementById('pagination-info');
        
        if (!paginationList || !paginationInfo) return;
        
        const startItem = (currentPage - 1) * this.pageSize + 1;
        const endItem = Math.min(currentPage * this.pageSize, this.totalRecords);
        paginationInfo.textContent = `Gösterilen: ${startItem}-${endItem} / ${this.totalRecords}`;
        
        let paginationHTML = '';
        
        // Önceki sayfa
        paginationHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="departmentManager.goToPage(${currentPage - 1})">
                    <i class="previous"></i>
                </a>
            </li>
        `;
        
        // Sayfa numaraları
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                paginationHTML += `
                    <li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="departmentManager.goToPage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }
        
        // Sonraki sayfa
        paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="departmentManager.goToPage(${currentPage + 1})">
                    <i class="next"></i>
                </a>
            </li>
        `;
        
        paginationList.innerHTML = paginationHTML;
    }

    // Sayfa değiştir
    goToPage(page) {
        if (page < 1) return;
        this.currentPage = page;
        this.loadDepartments();
    }

    // Hata mesajı göster
    showError(message) {
        if (window.toastr) {
            toastr.error(message, 'Hata');
        } else {
            alert(message);
        }
    }

    // Başarı mesajı göster
    showSuccess(message) {
        if (window.toastr) {
            toastr.success(message, 'Başarılı');
        } else {
            alert(message);
        }
    }

    // Departman düzenle
    editDepartment(departmentId) {
        this.openEditModal(departmentId);
    }

    // Düzenleme modalını aç
    async openEditModal(departmentId) {
        const modal = document.getElementById('kt_modal_edit_department');
        const loadingDiv = document.getElementById('edit-modal-loading');
        const form = document.getElementById('edit_department_form');
        const errorDiv = document.getElementById('edit-modal-error');
        
        if (!modal) return;
        
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        if (loadingDiv) loadingDiv.style.display = 'flex';
        if (form) form.style.display = 'none';
        if (errorDiv) errorDiv.style.display = 'none';
        
        try {
            const result = await DepartmentAPI.getDepartmentById(departmentId);
            const department = result.data || result;
            this.populateEditForm(department);
            this.initEditModalEvents(departmentId);
            
        } catch (error) {
            console.error('Departman bilgileri yükleme hatası:', error);
            if (errorDiv) {
                document.getElementById('edit-error-message').textContent = window.APIConfig.formatErrorMessage(error);
                errorDiv.style.display = 'flex';
            }
        } finally {
            if (loadingDiv) loadingDiv.style.display = 'none';
        }
    }

    // Düzenleme formunu doldur
    populateEditForm(department) {
        document.getElementById('edit_department_id').value = department.id;
        document.getElementById('edit_department_name').value = department.departmentName;
        document.getElementById('edit_department_description').value = department.description || '';
        document.getElementById('edit_manager_name').value = department.managerName || '';
        
        if (window.select2Instances) {
            if (window.select2Instances['edit-parent-department-wrapper']) {
                // Parent department ID'sini bul
                let parentId = '';
                if (department.parentDepartmentName) {
                    const parentDept = this.departments.find(d => d.departmentName === department.parentDepartmentName);
                    parentId = parentDept ? parentDept.id.toString() : '';
                }
                window.select2Instances['edit-parent-department-wrapper'].setValue(parentId);
            }
            if (window.select2Instances['edit-status-wrapper']) {
                window.select2Instances['edit-status-wrapper'].setValue(department.isActive.toString());
            }
        }
        
        document.getElementById('edit_department_form').style.display = 'block';
    }

    // Düzenleme modalı event'lerini başlat
    initEditModalEvents(departmentId) {
        const form = document.getElementById('edit_department_form');
        const submitBtn = form.querySelector('[data-kt-edit-modal-action="submit"]');
        
        form.removeEventListener('submit', this.handleEditSubmit);
        this.handleEditSubmit = (e) => {
            e.preventDefault();
            this.handleEditSubmitAction(departmentId, submitBtn);
        };
        form.addEventListener('submit', this.handleEditSubmit);
        
        this.initEditSelectEvents();
    }

    // Düzenleme select event'lerini başlat
    initEditSelectEvents() {
        const parentWrapper = document.getElementById('edit-parent-department-wrapper');
        if (parentWrapper) {
            this.initEditParentSelect(parentWrapper);
        }
        
        const statusWrapper = document.getElementById('edit-status-wrapper');
        if (statusWrapper) {
            this.initEditStatusSelect(statusWrapper);
        }
    }

    // Parent department select'i başlat
    async initEditParentSelect(wrapper) {
        try {
            const result = await DepartmentAPI.getRootDepartments();
            const departments = result.data || result;
            const options = [
                { value: '', text: 'Üst Departman Yok' },
                ...departments
                    .filter(d => d && d.id && d.name)
                    .map(d => ({ value: d.id.toString(), text: d.name }))
            ];
            
            if (window.select2Instances && window.select2Instances['edit-parent-department-wrapper']) {
                window.select2Instances['edit-parent-department-wrapper'].updateOptions(options);
            }
        } catch (error) {
            console.error('Parent departments yükleme hatası:', error);
        }
    }

    // Status select'i başlat
    initEditStatusSelect(wrapper) {
        const options = [
            { value: 'true', text: 'Aktif' },
            { value: 'false', text: 'Pasif' }
        ];
        
        if (window.select2Instances && window.select2Instances['edit-status-wrapper']) {
            window.select2Instances['edit-status-wrapper'].updateOptions(options);
        }
    }

    // Düzenleme formunu gönder
    async handleEditSubmitAction(departmentId, submitBtn) {
        const form = document.getElementById('edit_department_form');
        const formData = new FormData(form);
        
        const departmentData = {
            name: formData.get('department_name'),
            description: formData.get('department_description'),
            parentDepartmentId: formData.get('parent_department_id') || null,
            managerName: formData.get('manager_name'),
            isActive: formData.get('is_active') === 'true'
        };
        
        submitBtn.setAttribute('data-kt-indicator', 'on');
        
        try {
            const result = await DepartmentAPI.updateDepartment(departmentId, departmentData);
            this.showSuccess(window.APIConfig.getSuccessMessage('DEPARTMENT_UPDATED'));
            this.closeEditModal();
            this.loadDepartments();
            
        } catch (error) {
            console.error('Departman güncelleme hatası:', error);
            this.showError(window.APIConfig.formatErrorMessage(error));
        } finally {
            submitBtn.removeAttribute('data-kt-indicator');
        }
    }

    // Düzenleme modalını kapat
    closeEditModal() {
        const modal = document.getElementById('kt_modal_edit_department');
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        }
    }

    // Departman sil
    async deleteDepartment(departmentId, departmentName) {
        const modal = document.getElementById('kt_modal_delete_department');
        const title = document.getElementById('delete-modal-title');
        const description = document.getElementById('delete-modal-description');
        
        if (title) title.textContent = `"${departmentName}" Departmanını Sil`;
        if (description) description.textContent = `"${departmentName}" departmanını silmek istediğinizden emin misiniz?`;
        
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        const confirmBtn = document.getElementById('confirm-delete-btn');
        if (confirmBtn) {
            confirmBtn.onclick = async () => {
                confirmBtn.setAttribute('data-kt-indicator', 'on');
                
                try {
                    const result = await DepartmentAPI.deleteDepartment(departmentId);
                    this.showSuccess(window.APIConfig.getSuccessMessage('DEPARTMENT_DELETED'));
                    bsModal.hide();
                    this.loadDepartments();
                    
                } catch (error) {
                    console.error('Departman silme hatası:', error);
                    this.showError(window.APIConfig.formatErrorMessage(error));
                } finally {
                    confirmBtn.removeAttribute('data-kt-indicator');
                }
            };
        }
    }

    // Modal kapat
    closeModal() {
        const modal = document.getElementById('kt_modal_new_department');
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        }
    }

    // Üst departmanları yükle
    async loadParentDepartments() {
        try {
            const select = window.jQuery ? window.jQuery('#parent-department-select') : document.getElementById('parent-department-select');
            if (!select) return;
            if (window.jQuery && select.data && select.data('select2')) {
                select.select2('destroy');
            }
            if (window.jQuery) {
                select.html('<option value="">Yükleniyor...</option>');
            } else {
                select.innerHTML = '<option value="">Yükleniyor...</option>';
            }
            const result = await window.APIConfig.apiRequest('/api/departments/root/select-list', { method: 'GET' });
            const departments = result.data || result;
            const optionsHtml = '<option value="">Üst Departman Yok</option>' + this.buildDepartmentOptions(departments, 0);
            if (window.jQuery) {
                select.html(optionsHtml);
                select.select2();
            } else {
                select.innerHTML = optionsHtml;
            }
        } catch (error) {
            console.error('Üst departmanlar yüklenemedi:', error);
        }
    }

    // Hiyerarşik select option oluşturucu
    buildDepartmentOptions(departments, level = 0) {
        let options = '';
        const indent = '&nbsp;'.repeat(level * 4); // Her seviye için girinti
        departments.forEach(dept => {
            options += `<option value="${dept.id}">${indent}${dept.name}</option>`;
            if (dept.subDepartments && dept.subDepartments.length > 0) {
                options += this.buildDepartmentOptions(dept.subDepartments, level + 1);
            }
        });
        return options;
    }

    // Varsayılan parent options'ları ayarla
    setDefaultParentOptions() {
        const defaultOptions = [
            { value: '', text: 'Üst Departman Yok' }
        ];
        
        if (window.select2Instances) {
            if (window.select2Instances['parent-department-wrapper']) {
                window.select2Instances['parent-department-wrapper'].updateOptions(defaultOptions);
            }
            if (window.select2Instances['filter-parent-wrapper']) {
                window.select2Instances['filter-parent-wrapper'].updateOptions(defaultOptions);
            }
        }
    }
}

