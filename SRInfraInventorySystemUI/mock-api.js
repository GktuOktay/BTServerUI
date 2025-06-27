// Mock API for testing purposes
class MockAPI {
    constructor() {
        // Local storage'dan verileri yükle veya varsayılan verileri kullan
        this.departments = JSON.parse(localStorage.getItem('mock_departments')) || [
            {
                id: 1,
                departmentName: "Bilgi İşlem Müdürlüğü",
                parentDepartmentName: null,
                description: "Şirketin bilgi teknolojileri altyapısını yöneten departman",
                managerName: "Ahmet Yılmaz",
                personCount: 12,
                isActive: true,
                createdAt: "2024-01-01T00:00:00",
                updatedAt: "2024-01-01T00:00:00"
            },
            {
                id: 2,
                departmentName: "İnsan Kaynakları Müdürlüğü",
                parentDepartmentName: null,
                description: "Personel yönetimi ve işe alım süreçlerini yürüten departman",
                managerName: "Fatma Demir",
                personCount: 8,
                isActive: true,
                createdAt: "2024-01-01T00:00:00",
                updatedAt: "2024-01-01T00:00:00"
            },
            {
                id: 3,
                departmentName: "Muhasebe Müdürlüğü",
                parentDepartmentName: null,
                description: "Finansal işlemler ve muhasebe süreçlerini yöneten departman",
                managerName: "Mehmet Kaya",
                personCount: 6,
                isActive: true,
                createdAt: "2024-01-01T00:00:00",
                updatedAt: "2024-01-01T00:00:00"
            },
            {
                id: 4,
                departmentName: "Yazılım Geliştirme",
                parentDepartmentName: "Bilgi İşlem Müdürlüğü",
                description: "Kurumsal yazılım projelerini geliştiren ekip",
                managerName: "Zeynep Özkan",
                personCount: 15,
                isActive: true,
                createdAt: "2024-01-01T00:00:00",
                updatedAt: "2024-01-01T00:00:00"
            },
            {
                id: 5,
                departmentName: "Sistem Yönetimi",
                parentDepartmentName: "Bilgi İşlem Müdürlüğü",
                description: "IT altyapısı ve sistem yönetimi hizmetleri",
                managerName: "",
                personCount: 5,
                isActive: true,
                createdAt: "2024-01-01T00:00:00",
                updatedAt: "2024-01-01T00:00:00"
            },
            {
                id: 6,
                departmentName: "İşe Alım",
                parentDepartmentName: "İnsan Kaynakları Müdürlüğü",
                description: "",
                managerName: "Canan Şahin",
                personCount: 3,
                isActive: true,
                createdAt: "2024-01-01T00:00:00",
                updatedAt: "2024-01-01T00:00:00"
            },
            {
                id: 7,
                departmentName: "Eğitim ve Gelişim",
                parentDepartmentName: "İnsan Kaynakları Müdürlüğü",
                description: "Personel eğitimi ve kariyer gelişimi programları",
                managerName: "",
                personCount: 2,
                isActive: true,
                createdAt: "2024-01-01T00:00:00",
                updatedAt: "2024-01-01T00:00:00"
            },
            {
                id: 8,
                departmentName: "Finansal Raporlama",
                parentDepartmentName: "Muhasebe Müdürlüğü",
                description: "Finansal raporlama ve analiz işlemleri",
                managerName: "Elif Yıldız",
                personCount: 4,
                isActive: true,
                createdAt: "2024-01-01T00:00:00",
                updatedAt: "2024-01-01T00:00:00"
            },
            {
                id: 9,
                departmentName: "Satış Müdürlüğü",
                parentDepartmentName: null,
                description: "Şirket satış stratejilerini yöneten departman",
                managerName: "Burak Arslan",
                personCount: 18,
                isActive: true,
                createdAt: "2024-01-01T00:00:00",
                updatedAt: "2024-01-01T00:00:00"
            },
            {
                id: 10,
                departmentName: "Pazarlama",
                parentDepartmentName: "Satış Müdürlüğü",
                description: "Pazarlama stratejileri ve kampanya yönetimi",
                managerName: "Selin Öztürk",
                personCount: 7,
                isActive: true,
                createdAt: "2024-01-01T00:00:00",
                updatedAt: "2024-01-01T00:00:00"
            }
        ];
        
        this.nextId = Math.max(...this.departments.map(d => d.id), 0) + 1;
    }

    // Verileri localStorage'a kaydet
    saveToStorage() {
        localStorage.setItem('mock_departments', JSON.stringify(this.departments));
    }

    // Departmanları getir
    async getDepartments(params = {}) {
        console.log('Mock API: getDepartments called with params:', params);
        
        let filteredDepartments = [...this.departments];

        // Filtreleme
        if (params.name) {
            filteredDepartments = filteredDepartments.filter(d => 
                d.departmentName.toLowerCase().includes(params.name.toLowerCase())
            );
        }

        if (params.isActive !== undefined && params.isActive !== null) {
            filteredDepartments = filteredDepartments.filter(d => 
                d.isActive === params.isActive
            );
        }

        if (params.parentDepartmentId !== undefined && params.parentDepartmentId !== null) {
            if (params.parentDepartmentId === '') {
                filteredDepartments = filteredDepartments.filter(d => 
                    d.parentDepartmentName === null
                );
            } else {
                // Parent department ID'ye göre filtreleme için önce parent department'ı bul
                const parentDept = this.departments.find(d => d.id === parseInt(params.parentDepartmentId));
                if (parentDept) {
                    filteredDepartments = filteredDepartments.filter(d => 
                        d.parentDepartmentName === parentDept.departmentName
                    );
                }
            }
        }

        // Sayfalama
        const pageNumber = parseInt(params.pageNumber) || 1;
        const pageSize = parseInt(params.pageSize) || 10;
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pagedDepartments = filteredDepartments.slice(startIndex, endIndex);

        // API response formatını simüle et
        return {
            success: true,
            data: pagedDepartments,
            totalCount: filteredDepartments.length,
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalPages: Math.ceil(filteredDepartments.length / pageSize)
        };
    }

    // Departman ekle
    async createDepartment(departmentData) {
        console.log('Mock API: createDepartment called with:', departmentData);
        
        // Parent department adını bul
        let parentDepartmentName = null;
        if (departmentData.parentDepartmentId) {
            const parentDept = this.departments.find(d => d.id === parseInt(departmentData.parentDepartmentId));
            parentDepartmentName = parentDept ? parentDept.departmentName : null;
        }
        
        const newDepartment = {
            id: this.nextId++,
            departmentName: departmentData.name,
            parentDepartmentName: parentDepartmentName,
            description: departmentData.description || "",
            managerName: departmentData.managerName || "",
            personCount: 0,
            isActive: departmentData.isActive !== undefined ? departmentData.isActive : true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.departments.push(newDepartment);
        this.saveToStorage();

        return {
            success: true,
            message: 'Departman başarıyla oluşturuldu',
            data: newDepartment
        };
    }

    // Departman güncelle
    async updateDepartment(id, departmentData) {
        console.log('Mock API: updateDepartment called with id:', id, 'data:', departmentData);
        
        const index = this.departments.findIndex(d => d.id === parseInt(id));
        if (index === -1) {
            return {
                success: false,
                message: 'Departman bulunamadı'
            };
        }

        // Parent department adını bul
        let parentDepartmentName = null;
        if (departmentData.parentDepartmentId) {
            const parentDept = this.departments.find(d => d.id === parseInt(departmentData.parentDepartmentId));
            parentDepartmentName = parentDept ? parentDept.departmentName : null;
        }

        this.departments[index] = {
            ...this.departments[index],
            departmentName: departmentData.name,
            parentDepartmentName: parentDepartmentName,
            description: departmentData.description || "",
            managerName: departmentData.managerName || "",
            isActive: departmentData.isActive,
            updatedAt: new Date().toISOString()
        };

        this.saveToStorage();

        return {
            success: true,
            message: 'Departman başarıyla güncellendi',
            data: this.departments[index]
        };
    }

    // Departman sil
    async deleteDepartment(id) {
        console.log('Mock API: deleteDepartment called with id:', id);
        
        const index = this.departments.findIndex(d => d.id === parseInt(id));
        if (index === -1) {
            return {
                success: false,
                message: 'Departman bulunamadı'
            };
        }

        // Alt departmanları kontrol et
        const hasChildren = this.departments.some(d => d.parentDepartmentId === parseInt(id));
        if (hasChildren) {
            return {
                success: false,
                message: 'Bu departmana bağlı alt departmanlar bulunmaktadır',
                hasData: true
            };
        }

        this.departments.splice(index, 1);
        this.saveToStorage();

        return {
            success: true,
            message: 'Departman başarıyla silindi'
        };
    }

    // Departman detayı getir
    async getDepartmentById(id) {
        console.log('Mock API: getDepartmentById called with id:', id);
        
        const department = this.departments.find(d => d.id === parseInt(id));
        if (!department) {
            return {
                success: false,
                message: 'Departman bulunamadı'
            };
        }

        return {
            success: true,
            data: department
        };
    }

    // Root departmanları getir (select list için)
    async getRootDepartments() {
        console.log('Mock API: getRootDepartments called');
        
        const rootDepartments = this.departments
            .filter(d => d.isActive)
            .map(d => ({
                value: d.id.toString(),
                text: d.departmentName
            }));

        return {
            success: true,
            data: rootDepartments
        };
    }
}

// Global mock API instance oluştur
window.mockAPI = new MockAPI();

// Fetch API'yi override et
const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
    console.log('Mock API: Intercepted fetch request to:', url);
    
    // API URL'lerini yakala
    if (url.includes('/api/Department')) {
        const mockAPI = window.mockAPI;
        
        // GET request - departmanları listele
        if (options.method === 'GET' || !options.method) {
            if (url.includes('/root/select-list')) {
                return mockAPI.getRootDepartments().then(result => {
                    return new Response(JSON.stringify(result), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                });
            } else if (url.includes('/api/Department/') && !url.includes('?')) {
                // Tek departman getir
                const id = url.split('/').pop();
                return mockAPI.getDepartmentById(id).then(result => {
                    return new Response(JSON.stringify(result), {
                        status: result.success ? 200 : 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                });
            } else {
                // Departmanları listele
                const urlObj = new URL(url, 'http://localhost');
                const params = Object.fromEntries(urlObj.searchParams.entries());
                return mockAPI.getDepartments(params).then(result => {
                    return new Response(JSON.stringify(result), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                });
            }
        }
        
        // POST request - yeni departman ekle
        if (options.method === 'POST') {
            return new Promise((resolve, reject) => {
                if (!options.body) {
                    reject(new Error('No body provided'));
                    return;
                }
                
                const data = JSON.parse(options.body);
                mockAPI.createDepartment(data).then(result => {
                    resolve(new Response(JSON.stringify(result), {
                        status: result.success ? 201 : 400,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }).catch(reject);
            });
        }
        
        // PUT request - departman güncelle
        if (options.method === 'PUT') {
            const id = url.split('/').pop();
            return new Promise((resolve, reject) => {
                if (!options.body) {
                    reject(new Error('No body provided'));
                    return;
                }
                
                const data = JSON.parse(options.body);
                mockAPI.updateDepartment(id, data).then(result => {
                    resolve(new Response(JSON.stringify(result), {
                        status: result.success ? 200 : 404,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }).catch(reject);
            });
        }
        
        // DELETE request - departman sil
        if (options.method === 'DELETE') {
            const id = url.split('/').pop();
            return mockAPI.deleteDepartment(id).then(result => {
                return new Response(JSON.stringify(result), {
                    status: result.success ? 200 : (result.hasData ? 400 : 404),
                    headers: { 'Content-Type': 'application/json' }
                });
            });
        }
    }
    
    // Diğer request'ler için orijinal fetch'i kullan
    return originalFetch(url, options);
};

console.log('Mock API loaded successfully!'); 