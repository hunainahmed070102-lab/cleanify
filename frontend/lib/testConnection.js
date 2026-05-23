// Test MongoDB Connection
// Run this with: node lib/testConnection.js

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cleanify';

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', MONGODB_URI);
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Collections in database:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Count documents
    const Booking = mongoose.models.Booking || mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));
    const count = await Booking.collection.countDocuments();
    console.log(`\n📊 Total bookings: ${count}`);
    
    await mongoose.disconnect();
    console.log('\n✅ Connection test completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
