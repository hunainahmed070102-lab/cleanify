import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  serviceCategory: {
    type: String,
    required: true
  },
  subService: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'office', 'commercial']
  },
  rooms: {
    type: Number,
    required: true,
    min: 1
  },
  area: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Prevent model compilation error in development
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
