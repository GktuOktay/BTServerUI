// Departman API fonksiyonları

// Listeleme (GET /api/departments)
function getDepartments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = '/api/departments' + (query ? `?${query}` : '');
    return window.APIConfig.apiRequest(endpoint, { method: 'GET' });
}

// Tek departman (GET /api/departments/{id})
function getDepartmentById(id) {
    return window.APIConfig.apiRequest(`/api/departments/${id}`, { method: 'GET' });
}

// Departman oluştur (POST /api/departments)
function createDepartment(data) {
    return window.APIConfig.apiRequest('/api/departments', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

// Departman güncelle (PUT /api/departments/{id})
function updateDepartment(id, data) {
    return window.APIConfig.apiRequest(`/api/departments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

// Departman sil (DELETE /api/departments/{id})
function deleteDepartment(id) {
    return window.APIConfig.apiRequest(`/api/departments/${id}`, {
        method: 'DELETE' });
}

// Root departmanlar (GET /api/departments/root)
function getRootDepartments() {
    return window.APIConfig.apiRequest('/api/departments/root', { method: 'GET' });
}

// Diğer fonksiyonlar gerektiğinde eklenebilir

// Dışa aktar
window.DepartmentAPI = {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getRootDepartments
}; 