const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverLicenseNo: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  vehiclePlate: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  // İlave sürücü özellikleri buraya eklenebilir
});

module.exports = mongoose.model('driver', driverSchema); 