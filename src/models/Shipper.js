const mongoose = require('mongoose');

const shipperSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  taxNumber: {
    type: String,
    required: true
  },
  sector: String,
  companyAddress: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  totalLoads: {
    type: Number,
    default: 0
  },
  completedLoads: {
    type: Number,
    default: 0
  },
  cancelledLoads: {
    type: Number,
    default: 0
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('shipper', shipperSchema); 