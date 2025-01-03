const mongoose = require('mongoose');

const loadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  loadType: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  weight: Number,
  volume: Number,
  budget: {
    type: Number,
    required: true
  },
  distance: Number,
  vehicleType: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offerCount: {
    type: Number,
    default: 0
  },
  deadline: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Load', loadSchema); 