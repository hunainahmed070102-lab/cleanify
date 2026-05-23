// Booking Service - MongoDB API operations

const API_BASE = '/api';

// Generate unique booking ID
export const generateBookingId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `BK-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
};

// Get all bookings from MongoDB
export const getAllBookings = async () => {
  try {
    const response = await fetch(`${API_BASE}/bookings`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    
    console.error('Failed to fetch bookings:', result.error);
    return [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

// Save a new booking to MongoDB
export const saveBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Booking saved to MongoDB:', bookingData.id);
      return result.data;
    }
    
    console.error('Failed to save booking:', result.error);
    return null;
  } catch (error) {
    console.error('Error saving booking:', error);
    return null;
  }
};

// Get single booking by ID
export const getBookingById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/${id}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
};

// Update booking status
export const updateBookingStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Booking status updated:', id, status);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating booking:', error);
    return false;
  }
};

// Get booking statistics
export const getBookingStats = async () => {
  try {
    const bookings = await getAllBookings();
    
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'Pending').length,
      confirmed: bookings.filter(b => b.status === 'Confirmed').length,
      completed: bookings.filter(b => b.status === 'Completed').length,
      cancelled: bookings.filter(b => b.status === 'Cancelled').length,
      revenue: bookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      revenue: 0
    };
  }
};

// Delete booking
export const deleteBooking = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Booking deleted:', id);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting booking:', error);
    return false;
  }
};
