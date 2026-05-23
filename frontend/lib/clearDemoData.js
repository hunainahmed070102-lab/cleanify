/**
 * Clear all demo data from localStorage
 * Run this once to reset the system for fresh testing
 */
export const clearAllDemoData = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear bookings
    localStorage.removeItem('cleanify_bookings');
    
    // Clear notifications
    localStorage.removeItem('cleanify_notifications');
    
    // Reset booking counter to start from 1001
    localStorage.setItem('cleanify_booking_counter', '1001');
    
    // Clear reviews
    localStorage.removeItem('cleanify_reviews');
    
    // Clear services cache
    localStorage.removeItem('cleanify_services');
    
    console.log('✅ All demo data cleared successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    return false;
  }
};

/**
 * Check if system has any data
 */
export const hasAnyData = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const bookings = localStorage.getItem('cleanify_bookings');
    return bookings && JSON.parse(bookings).length > 0;
  } catch {
    return false;
  }
};
