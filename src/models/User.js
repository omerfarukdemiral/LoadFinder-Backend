const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  avatar: {
    type: String,
    default: 'https://mwondkyurmrltkfhnfhu.supabase.co/storage/v1/object/public/LoadFinder/profile-pictures/avatar.png'
  },
  role: {
    type: String,
    enum: ['driver', 'shipper', 'admin'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  // Role'e göre referans
  profileDetails: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'role'
  },
  googleId: {
    type: String,
    sparse: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

module.exports = mongoose.model('User', userSchema); 