const BaseService = require('./baseService');
const Load = require('../models/Load');

class LoadService extends BaseService {
  constructor() {
    super(Load);
  }

  // Özel yük metodları
  async getActiveLoads() {
    return await this.find({ status: 'active' });
  }

  async createLoad(loadData, userId) {
    const load = await this.create({
      ...loadData,
      createdBy: userId
    });
    // Ek işlemler (örn: bildirim gönderme)
    return load;
  }

  async searchLoads(filters) {
    const query = {
      ...(filters.status && { status: filters.status }),
      ...(filters.vehicleType && { vehicleType: filters.vehicleType }),
      ...(filters.from && { from: new RegExp(filters.from, 'i') }),
      ...(filters.to && { to: new RegExp(filters.to, 'i') })
    };

    return await this.find(query);
  }
}

module.exports = new LoadService(); 