const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Shipper = require('../models/Shipper');
const logger = require('./logger');

const MOCK_USERS_DETAILED = [
  {
    username: 'admin',
    name: 'Sistem Yöneticisi',
    email: 'admin@edat.app.com',
    phone: '0532 555 0001',
    role: 'admin',
    status: 'active',
    avatar: 'defaultAvatar.jpg',
    password: 'loadfinder2024'
  },
  {
    username: 'ahmetyilmaz',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@gmail.com',
    phone: '0532 555 0002',
    role: 'driver',
    status: 'active',
    avatar: 'defaultAvatar.jpg',
    password: 'loadfinder2024',
    driverDetails: {
      driverLicenseNo: '34ABC123456',
      vehicleType: 'tir',
      vehiclePlate: '34 TIR 123',
      experience: '8'
    }
  },
  {
    username: 'mehmetdemir',
    name: 'Mehmet Demir',
    email: 'mehmet.demir@gmail.com',
    phone: '0532 555 0003',
    role: 'driver',
    status: 'active',
    avatar: 'defaultAvatar.jpg',
    password: 'loadfinder2024',
    driverDetails: {
      driverLicenseNo: '34XYZ789012',
      vehicleType: 'kamyon',
      vehiclePlate: '34 KMY 456',
      experience: '5'
    }
  },
  {
    username: 'anadolulojistik',
    name: 'Anadolu Lojistik',
    email: 'info@anadolulojistik.com',
    phone: '0212 555 0001',
    role: 'shipper',
    status: 'active',
    avatar: 'defaultAvatar.jpg',
    password: 'loadfinder2024',
    shipperDetails: {
      companyName: 'Anadolu Lojistik A.Ş.',
      taxNumber: '1234567890',
      sector: 'Uluslararası Taşımacılık',
      companyAddress: 'Atatürk Mah. İstanbul Cad. No:123 Kağıthane / İstanbul',
      rating: 4.8,
      totalLoads: 156,
      completedLoads: 142,
      cancelledLoads: 14,
      verificationStatus: 'verified'
    }
  },
  {
    username: 'marmaralojistik',
    name: 'Marmara Lojistik',
    email: 'info@marmaralojistik.com',
    phone: '0212 555 0002',
    role: 'shipper',
    status: 'active',
    avatar: 'defaultAvatar.jpg',
    password: 'loadfinder2024',
    shipperDetails: {
      companyName: 'Marmara Lojistik Ltd. Şti.',
      taxNumber: '9876543210',
      sector: 'Yurt İçi Taşımacılık',
      companyAddress: 'Barbaros Mah. Ankara Cad. No:456 Beşiktaş / İstanbul',
      rating: 4.6,
      totalLoads: 98,
      completedLoads: 89,
      cancelledLoads: 9,
      verificationStatus: 'verified'
    }
  }
];

async function initializeData() {
  try {
    logger.info('Veri initialize işlemi başlatılıyor...');

    // Veritabanında kullanıcı var mı kontrol et
    const existingUsers = await User.countDocuments();
    logger.info(`Mevcut kullanıcı sayısı: ${existingUsers}`);

    if (existingUsers > 0) {
      logger.info('Veritabanında zaten kullanıcılar mevcut. İnitializasyon atlanıyor.');
      return;
    }

    // Her bir kullanıcı için
    for (const userData of MOCK_USERS_DETAILED) {
      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Yeni kullanıcı oluştur
      const user = new User({
        username: userData.username,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
        avatar: userData.avatar,
        password: hashedPassword,
        registrationDate: new Date()
      });

      await user.save();
      logger.info(`${userData.username} kullanıcısı kaydedildi`);

      // Role'e göre ek profil detaylarını oluştur
      if (userData.role === 'driver' && userData.driverDetails) {
        logger.info(`${userData.username} için sürücü profili oluşturuluyor...`);
        const driver = new Driver({
          user: user._id,
          ...userData.driverDetails
        });
        await driver.save();
        user.profileDetails = driver._id;
        logger.info(`${userData.username} sürücü profili oluşturuldu`);
      } else if (userData.role === 'shipper' && userData.shipperDetails) {
        logger.info(`${userData.username} için nakliyeci profili oluşturuluyor...`);
        const shipper = new Shipper({
          user: user._id,
          ...userData.shipperDetails
        });
        await shipper.save();
        user.profileDetails = shipper._id;
        logger.info(`${userData.username} nakliyeci profili oluşturuldu`);
      }

      await user.save();
    }

    logger.info('Tüm başlangıç verileri başarıyla yüklendi');
  } catch (error) {
    logger.error('Başlangıç verileri yüklenirken hata oluştu:', error);
    // Hatanın tam detayını görelim
    logger.error('Hata detayı:', error.stack);
    throw error;
  }
}

module.exports = initializeData; 