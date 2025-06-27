/**
 * API Haberleşme Konfigürasyonu
 * Tüm API endpoint'leri ve genel ayarlar burada merkezi olarak yönetilir
 */

class APIConfig {
    constructor() {
        // API Base URL - Gerçek API sunucusu
        this.API_BASE_URL = 'https://localhost:7239';
        
        // Timeout ayarları
        this.REQUEST_TIMEOUT = 30000; // 30 saniye
        this.RETRY_ATTEMPTS = 3;
        
        // Sayfalama ayarları
        this.DEFAULT_PAGE_SIZE = 10;
        this.MAX_PAGE_SIZE = 100;
        
        // Mesajlar
        this.MESSAGES = {
            SUCCESS: {
                DEPARTMENT_CREATED: 'Departman başarıyla oluşturuldu',
                DEPARTMENT_UPDATED: 'Departman başarıyla güncellendi',
                DEPARTMENT_DELETED: 'Departman başarıyla silindi',
                DATA_LOADED: 'Veriler başarıyla yüklendi'
            },
            ERROR: {
                NETWORK_ERROR: 'Ağ bağlantısı hatası oluştu',
                SERVER_ERROR: 'Sunucu hatası oluştu',
                TIMEOUT_ERROR: 'İstek zaman aşımına uğradı',
                VALIDATION_ERROR: 'Geçersiz veri formatı',
                NOT_FOUND: 'Kayıt bulunamadı',
                UNAUTHORIZED: 'Yetkisiz erişim',
                FORBIDDEN: 'Bu işlem için yetkiniz yok'
            }
        };
        
        // Endpoint grupları
        this.ENDPOINTS = {
            DEPARTMENTS: {
                LIST: '/api/departments',
                CREATE: '/api/departments',
                GET_BY_ID: (id) => `/api/departments/${id}`,
                UPDATE: (id) => `/api/departments/${id}`,
                DELETE: (id) => `/api/departments/${id}`,
                ROOT: '/api/departments/root',
                SIMPLE: '/api/departments/simple',
                ASSIGN_MANAGER: '/api/departments/assign-manager',
                HIERARCHICAL: '/api/departments/hierarchical',
                ROOT_SELECT_LIST: '/api/departments/root/select-list',
            }
        };
        
        // HTTP Headers
        this.DEFAULT_HEADERS = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };
    }
    
    /**
     * API isteği gönder
     * @param {string} endpoint - Endpoint URL'i
     * @param {Object} options - Fetch options
     * @returns {Promise} - Response promise
     */
    async apiRequest(endpoint, options = {}) {
        let url;
        if (/^https?:\/\//.test(endpoint)) {
            url = endpoint;
        } else {
            if (endpoint.startsWith('/')) {
                url = this.API_BASE_URL + endpoint;
            } else {
                url = this.API_BASE_URL + '/' + endpoint;
            }
        }
        const defaultOptions = {
            method: 'GET',
            headers: { ...this.DEFAULT_HEADERS },
            timeout: this.REQUEST_TIMEOUT
        };
        const requestOptions = { ...defaultOptions, ...options };
        return this.realRequest(url, requestOptions);
    }
    
    /**
     * Gerçek API isteği
     */
    async realRequest(url, options) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), options.timeout);
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // 204 No Content ise, body parse etme!
            if (response.status === 204) {
                return {};
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    /**
     * Hata mesajını formatla
     */
    formatErrorMessage(error) {
        if (error.name === 'AbortError') {
            return this.MESSAGES.ERROR.TIMEOUT_ERROR;
        }
        
        if (error.message.includes('404')) {
            return this.MESSAGES.ERROR.NOT_FOUND;
        }
        
        if (error.message.includes('401')) {
            return this.MESSAGES.ERROR.UNAUTHORIZED;
        }
        
        if (error.message.includes('403')) {
            return this.MESSAGES.ERROR.FORBIDDEN;
        }
        
        if (error.message.includes('NetworkError')) {
            return this.MESSAGES.ERROR.NETWORK_ERROR;
        }
        
        return this.MESSAGES.ERROR.SERVER_ERROR;
    }
    
    /**
     * Başarı mesajını al
     */
    getSuccessMessage(key) {
        return this.MESSAGES.SUCCESS[key] || 'İşlem başarılı';
    }
    
    /**
     * Hata mesajını al
     */
    getErrorMessage(key) {
        return this.MESSAGES.ERROR[key] || 'Bir hata oluştu';
    }
}

// Global API Config instance'ı
window.APIConfig = new APIConfig(); 