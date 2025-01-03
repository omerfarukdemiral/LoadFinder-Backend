# LoadFinder Backend Mimarisi (3-Tier Architecture)

## 1. Katmanlar

### 1.1 Controller Katmanı (Sunum)
- İstemciden gelen HTTP isteklerini karşılar
- Request/Response yönetimi yapar
- Service katmanını çağırır
- İş mantığı içermez

**Örnek:** `authController.js`

### 1.2 Service Katmanı (İş)
- İş mantığını içerir
- Veritabanı işlemlerini yönetir
- Controller katmanından çağrılır

**Örnek:** `authService.js`


### 1.3 Model Katmanı (Veri)
- Veritabanı şemalarını tanımlar
- Veri validasyonlarını içerir
- Veritabanı işlemlerini gerçekleştirir

**Örnek:** `Load.js`

## 2. Yardımcı Bileşenler

### 2.1 Middleware
- Request/Response döngüsüne müdahale eder
- Yetkilendirme, loglama, hata yakalama gibi işlemleri yapar

### 2.2 Utils
- Yardımcı fonksiyonlar
- Logger, dosya işlemleri, şifreleme vb.

### 2.3 Config
- Uygulama yapılandırmaları
- Ortam değişkenleri
- Veritabanı bağlantıları

## 3. Veri Akışı
1. İstemci isteği → Controller
2. Controller → Service
3. Service → Model(s)
4. Model → Veritabanı
5. Veritabanı → Model → Service → Controller → İstemci

## 4. Klasör Yapısı
backend/
├── src/
│ ├── controllers/ # HTTP istekleri yönetimi
│ ├── services/ # İş mantığı
│ ├── models/ # Veritabanı modelleri
│ ├── middlewares/ # Ara yazılımlar
│ ├── utils/ # Yardımcı fonksiyonlar
│ ├── config/ # Yapılandırmalar
│ ├── routes/ # API rotaları
│ └── validators/ # İstek validasyonları
├── tests/ # Testler
└── docs/ # API dokümantasyonu

## 5. Best Practices
1. Her katmanın tek bir sorumluluğu olmalı
2. Service'ler arası bağımlılıklar dependency injection ile yönetilmeli
3. İş mantığı sadece service katmanında olmalı
4. Controller'lar ince olmalı (thin controllers)
5. Model'ler sadece veri yapısını ve basit validasyonları içermeli

## 6. Örnek Akış Senaryosu

### 6.1 Yük Oluşturma İşlemi

    // 1. Controller Katmanı (loadController.js)
    async createLoad(req, res, next) {
    try {
    const load = await LoadService.createLoad(req.body, req.user.id);
    res.status(201).json(load);
    } catch (error) {
    next(error);
    }
    }
    // 2. Service Katmanı (loadService.js)
    async createLoad(loadData, userId) {
    const validatedData = await this.validateLoadData(loadData);
    const user = await UserService.findById(userId);
    const load = await Load.create({ ...validatedData, userId });
    await NotificationService.sendNewLoadNotification(load);
    return load;
    }
    // 3. Model Katmanı (Load.js)
    const loadSchema = new mongoose.Schema({
    title: String,
    description: String,
    budget: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    });


## 7. Hata Yönetimi

    javascript
    // 1. Özel Hata Sınıfları (errors/AppError.js)
    class AppError extends Error {
    constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = ${statusCode}.startsWith('4') ? 'fail' : 'error';
    }
    }
    // 2. Hata Middleware'i (middlewares/error.js)
    const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
    status: err.status,
    message: err.message
    });
    };


## 8. Güvenlik Önlemleri
        1. JWT tabanlı kimlik doğrulama
        2. Request rate limiting
        3. CORS yapılandırması
        4. Helmet güvenlik başlıkları
        5. Input validasyonu
        6. MongoDB injection koruması

## 9. Performans Optimizasyonu
        1. Veritabanı indeksleme
        2. Caching mekanizmaları
        3. Async/await kullanımı
        4. Bulk işlemler için toplu sorgular
        5. Gereksiz veritabanı sorgularından kaçınma