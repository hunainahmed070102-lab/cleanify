import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  extraRoomCharge: {
    type: Number,
    required: true
  },
  subServices: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Prevent model compilation error in development
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default Service;
