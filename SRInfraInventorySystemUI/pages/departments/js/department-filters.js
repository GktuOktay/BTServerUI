export default class DepartmentFilters {
    constructor(manager) {
        this.manager = manager;
        this.filters = {
            name: null,
            isActive: null,
            parentDepartmentId: null
        };
        this.init();
    }

    init() {
        const filterName = document.getElementById('filter-name-card');
        if (filterName) {
            filterName.addEventListener('input', (e) => {
                this.filters.name = e.target.value || null;
            });
        }

        const filterStatus = document.getElementById('filter-status-card');
        if (filterStatus) {
            filterStatus.addEventListener('change', (e) => {
                const value = e.target.value;
                this.filters.isActive = value === '' ? null : value === 'true';
            });
        }

        const filterParent = document.getElementById('filter-parent-card');
        if (filterParent) {
            filterParent.addEventListener('change', (e) => {
                const value = e.target.value;
                this.filters.parentDepartmentId = value === '' ? null : (value === 'null' ? null : value);
            });
        }
    }

    apply() {
        this.manager.currentPage = 1;
        this.manager.filters = { ...this.filters };
        this.manager.loadDepartments();
    }

    reset() {
        this.filters = {
            name: null,
            isActive: null,
            parentDepartmentId: null
        };

        const filterName = document.getElementById('filter-name-card');
        if (filterName) filterName.value = '';

        const filterStatus = document.getElementById('filter-status-card');
        if (filterStatus) filterStatus.value = '';

        const filterParent = document.getElementById('filter-parent-card');
        if (filterParent) filterParent.value = '';

        if (window.select2Instances) {
            if (window.select2Instances['filter-status-wrapper']) {
                window.select2Instances['filter-status-wrapper'].setValue('');
            }
            if (window.select2Instances['filter-parent-wrapper']) {
                window.select2Instances['filter-parent-wrapper'].setValue('');
            }
        }

        this.manager.currentPage = 1;
        this.manager.filters = { ...this.filters };
        this.manager.loadDepartments();
    }
}
