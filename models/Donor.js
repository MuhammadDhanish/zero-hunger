const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  organization: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  panNumber: { type: String, trim: true, uppercase: true },
  
  amount: { type: Number, required: true, min: 100 },
  donationType: { type: String, required: true, enum: ['one-time', 'monthly', 'annual'] },
  category: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  
  dedication: { type: String, trim: true },
  message: { type: String, trim: true },
  
  wantsTaxCert: { type: Boolean, default: false },
  wantsUpdates: { type: Boolean, default: false },
  publicWall: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donor', donorSchema);
