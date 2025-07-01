# Departman Listesi Modülü

## Genel Bakış
Bu modül, SR Infra Inventory System içinde departman yönetimi için geliştirilmiştir. Sadece belirtilen alanları gösterir ve gereksiz alanları UI'de kullanmaz.

## Özellikler

### Görüntülenen Alanlar
- **Departman Adı**: Departmanın tam adı
- **Açıklama**: Departman açıklaması
- **Yönetici**: Departman yöneticisinin adı
- **Kişi Sayısı**: Departmandaki personel sayısı
- **İşlemler**: Düzenle/Sil butonları

### Gösterilmeyen Alanlar
- ❌ Durum (isActive)
- ❌ Oluşturulma Tarihi (createdDate)
- ❌ Güncellenme Tarihi (updatedDate)
- ❌ Departman Kodu (code)

## Dosya Yapısı
```
pages/departments/
├── list.html          # Ana departman listesi sayfası
├── js/
│   ├── department.js          # Sayfaya özel ana dosya
│   ├── department-manager.js  # Listeleme ve işlemler
│   ├── department-create.js   # Yeni departman fonksiyonları
│   └── department-filters.js  # Filtre yönetimi
├── config.js          # API konfigürasyonu
└── README.md          # Bu dosya
```

## API Entegrasyonu

### Endpoint
```
GET /api/Department?name=Bilgi&pageNumber=1&pageSize=10&isActive=true
```

### Query Parametreleri
- `name` (string, optional): Departman adına göre filtreleme
- `isActive` (boolean, optional): Aktif/pasif durumu
- `pageNumber` (int, default: 1): Sayfa numarası
- `pageSize` (int, default: 10): Sayfadaki kayıt sayısı

### Response Formatı
```json
{
  "success": true,
  "isSuccess": true,
  "message": "Toplam 15 departman bulundu",
  "data": [
    {
      "id": "guid",
      "name": "Departman Adı",
      "description": "Açıklama",
      "managerPersonnelName": "Yönetici Adı",
      "personnelCount": 25,
      "isActive": true
    }
  ],
  "errors": []
}
```

## Konfigürasyon

### API URL Değiştirme
`config.js` dosyasında `API_BASE_URL` değerini güncelleyin:

```javascript
const CONFIG = {
    API_BASE_URL: 'https://your-api-server.com',
    // ...
};
```


## Kullanım

1. Ana sayfadan **İnsan Kaynakları > Departmanlar** menüsüne tıklayın
2. Departman listesi yüklenir
3. **Filtrele** butonuyla ad ve duruma göre arama yapın
4. **Yeni Departman** butonuyla yeni departman ekleyin
5. Her satırdaki **Düzenle/Sil** butonlarıyla işlem yapın

## Responsive Tasarım
- Masaüstü ve mobil cihazlarda uyumlu
- Bootstrap 5 tabanlı responsive tablo
- Mobilde horizontal scroll desteği

## JavaScript Fonksiyonları

### DepartmentManager Sınıfı
- `loadDepartments()`: API'den veri çeker
- `renderTable()`: Tabloyu oluşturur
- `handleNewDepartment()`: Yeni departman ekler
- `editDepartment()`: Departman düzenler
- `deleteDepartment()`: Departman siler

### DepartmentFilters Sınıfı
- `apply()`: Filtreleri uygular
- `reset()`: Filtreleri temizler

### Global Fonksiyonlar
- `applyFilters()`: HTML'den çağrılır, `DepartmentFilters.apply()` metodunu çalıştırır
- `resetFilters()`: HTML'den çağrılır, `DepartmentFilters.reset()` metodunu çalıştırır

## Hata Yönetimi
- API hataları console'da loglanır
- Kullanıcıya toast/alert ile bilgi verilir

## Gelecek Geliştirmeler
- [ ] Departman düzenleme modalı
- [ ] Gelişmiş pagination
- [ ] Excel export
- [ ] Bulk işlemler
- [ ] Arama geçmişi

---
*Bu modül Türkçe UI desteği ile geliştirilmiştir.* 