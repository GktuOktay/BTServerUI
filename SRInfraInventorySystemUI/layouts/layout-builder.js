/**
 * Layout Builder - Ortak template'i dinamik olarak doldurur
 */
class LayoutBuilder {
    constructor() {
        this.baseTemplate = '';
        this.loadBaseTemplate();
    }

    // Base template'i yükle
    async loadBaseTemplate() {
        try {
            const response = await fetch('../layouts/base.html');
            this.baseTemplate = await response.text();
        } catch (error) {
            console.error('Base template yüklenemedi:', error);
        }
    }

    // Sayfa oluştur
    buildPage(config) {
        let html = this.baseTemplate;

        // Temel değişkenleri değiştir
        html = html.replace(/{{PAGE_TITLE}}/g, config.pageTitle || 'Sayfa');
        html = html.replace(/{{PAGE_DESCRIPTION}}/g, config.pageDescription || '');
        html = html.replace(/{{PAGE_KEYWORDS}}/g, config.pageKeywords || '');

        // Menü aktif durumları
        html = html.replace(/{{DASHBOARD_ACTIVE}}/g, config.activeMenu === 'dashboard' ? 'here show' : '');
        html = html.replace(/{{HR_ACTIVE}}/g, config.activeMenu === 'hr' ? 'here show' : '');
        html = html.replace(/{{INVENTORY_ACTIVE}}/g, config.activeMenu === 'inventory' ? 'here show' : '');
        html = html.replace(/{{REPORTS_ACTIVE}}/g, config.activeMenu === 'reports' ? 'here show' : '');
        
        html = html.replace(/{{HOME_ACTIVE}}/g, config.activeSubMenu === 'home' ? 'active' : '');
        html = html.replace(/{{DEPARTMENTS_ACTIVE}}/g, config.activeSubMenu === 'departments' ? 'active' : '');
        html = html.replace(/{{PERSONNEL_ACTIVE}}/g, config.activeSubMenu === 'personnel' ? 'active' : '');
        html = html.replace(/{{ASSETS_ACTIVE}}/g, config.activeSubMenu === 'assets' ? 'active' : '');

        // Breadcrumb
        html = html.replace(/{{BREADCRUMB}}/g, config.breadcrumb || '');

        // Sayfa aksiyonları
        html = html.replace(/{{PAGE_ACTIONS}}/g, config.pageActions || '');

        // Ana içerik
        html = html.replace(/{{MAIN_CONTENT}}/g, config.mainContent || '');

        // Modaller
        html = html.replace(/{{MODALS}}/g, config.modals || '');

        // Ek CSS
        html = html.replace(/{{ADDITIONAL_CSS}}/g, config.additionalCSS || '');

        // Ek JavaScript
        html = html.replace(/{{ADDITIONAL_JS}}/g, config.additionalJS || '');

        return html;
    }

    // Breadcrumb oluştur
    static createBreadcrumb(items) {
        return items.map(item => {
            if (item.link) {
                return `
                    <li class="breadcrumb-item text-muted">
                        <a href="${item.link}" class="text-muted">${item.text}</a>
                    </li>
                    <li class="breadcrumb-item">
                        <span class="bullet bg-gray-200 w-5px h-2px"></span>
                    </li>
                `;
            } else {
                return `
                    <li class="breadcrumb-item text-dark">${item.text}</li>
                `;
            }
        }).join('');
    }

    // Sayfa aksiyonları oluştur
    static createPageActions(actions) {
        return actions.map(action => {
            if (action.type === 'button') {
                return `
                    <a href="${action.href || '#'}" class="btn btn-sm ${action.class || 'btn-primary'}" 
                       ${action.modal ? `data-bs-toggle="modal" data-bs-target="${action.modal}"` : ''}>
                        ${action.icon ? `<i class="${action.icon} me-2"></i>` : ''}${action.text}
                    </a>
                `;
            } else if (action.type === 'dropdown') {
                return `
                    <div class="me-4">
                        <a href="#" class="btn btn-sm btn-flex btn-light btn-active-primary fw-bolder" 
                           data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                            ${action.icon ? `<span class="svg-icon svg-icon-5 svg-icon-gray-500 me-1">${action.icon}</span>` : ''}
                            ${action.text}
                        </a>
                        <div class="menu menu-sub menu-sub-dropdown w-300px w-md-325px" data-kt-menu="true">
                            ${action.content || ''}
                        </div>
                    </div>
                `;
            }
        }).join('');
    }
}

// Global kullanım için
window.LayoutBuilder = LayoutBuilder; 