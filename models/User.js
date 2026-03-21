const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/, 'Only SRMIST institutional email IDs are allowed']
  },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  year: { 
    type: String, 
    enum: ['1', '2', '3'], 
    required: true 
  },
  experience_level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate'], 
    required: true 
  },
  status: { type: String, default: 'registered' }
}, { timestamps: { createdAt: 'registered_at', updatedAt: false } });

module.exports = mongoose.model('User', userSchema);