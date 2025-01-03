class BaseService {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findOne(filter) {
    return await this.model.findOne(filter);
  }

  async find(filter = {}, options = {}) {
    const {
      sort = { createdAt: -1 },
      limit = 10,
      page = 1,
      populate
    } = options;

    const query = this.model.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    if (populate) {
      query.populate(populate);
    }

    return await query;
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseService; 