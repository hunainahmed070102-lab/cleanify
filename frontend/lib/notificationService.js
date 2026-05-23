// Notification Service - Real-time notifications for Cleanify Admin Portal
import toast from 'react-hot-toast';

const ADMIN_WHATSAPP_NUMBER = '+923129660714';

// Send real-time notification to admin dashboard
export const sendAdminNotification = (booking) => {
  const notification = {
    id: `notif_${Date.now()}`,
    type: 'newBooking',
    booking: booking,
    timestamp: new Date().toISOString(),
    read: false
  };

  // Store notification in localStorage for admin dashboard
  if (typeof window !== 'undefined') {
    const notifications = JSON.parse(localStorage.getItem('cleanify_notifications') || '[]');
    notifications.unshift(notification);
    // Keep only last 50 notifications
    if (notifications.length > 50) notifications.splice(50);
    localStorage.setItem('cleanify_notifications', JSON.stringify(notifications));
    
    // Trigger event for real-time update
    window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));
  }

  return notification;
};

// Send WhatsApp notification using WhatsApp API
export const sendWhatsAppNotification = async (phone, message) => {
  try {
    // Format phone number (remove spaces, ensure + prefix)
    const formattedPhone = phone.replace(/\s/g, '');
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    // Open in new window/tab
    window.open(whatsappUrl, '_blank');
    
    console.log('✅ WhatsApp message prepared for:', formattedPhone);
    
    return { success: true, phone: formattedPhone, message };
  } catch (error) {
    console.error('❌ WhatsApp notification error:', error);
    return { success: false, error: error.message };
  }
};

// Send notification when new booking is created
export const notifyNewBooking = async (booking) => {
  // 1. Send real-time notification to admin dashboard
  sendAdminNotification(booking);

  // 2. Show toast notification
  toast.success(
    `Booking confirmed! ID: ${booking.id}`,
    { duration: 5000, icon: '📋' }
  );

  // 3. Log to console
  console.log('📧 New Booking Notification:', booking);

  return { success: true, booking };
};

// Send WhatsApp notification for status update
export const sendStatusUpdateWhatsApp = async (booking) => {
  const ADMIN_WHATSAPP_NUMBER = '+923129660714';
  
  const statusMessages = {
    'Confirmed': `✅ BOOKING CONFIRMED\n\nYour booking ${booking.id} has been confirmed!\n\nService: ${booking.subService}\nDate: ${booking.date}\nTime: ${booking.time}\nPrice: £${booking.totalPrice}\n\nThank you for choosing Cleanify!`,
    'Assigned to Team': `👷 TEAM ASSIGNED\n\nYour booking ${booking.id} has been assigned to our service team.\n\nService: ${booking.subService}\nDate: ${booking.date}\nTime: ${booking.time}\n\nOur team will contact you shortly.`,
    'In Progress': `🔧 SERVICE IN PROGRESS\n\nYour booking ${booking.id} is now in progress!\n\nService: ${booking.subService}\nAddress: ${booking.address}\n\nOur team is currently at your location.`,
    'Completed': `✨ SERVICE COMPLETED\n\nYour booking ${booking.id} has been completed successfully!\n\nService: ${booking.subService}\nTotal Price: £${booking.totalPrice}\nPayment Status: ${booking.paymentStatus || 'Unpaid'}\n\nThank you for choosing Cleanify! We hope you're satisfied with our service.`,
    'Cancelled': `❌ BOOKING CANCELLED\n\nYour booking ${booking.id} has been cancelled.\n\nService: ${booking.subService}\nDate: ${booking.date}\n\nIf you have any questions, please contact us.`
  };

  const message = statusMessages[booking.status] || `📋 BOOKING UPDATE\n\nYour booking ${booking.id} status has been updated to: ${booking.status}\n\nService: ${booking.subService}\nDate: ${booking.date}\nTime: ${booking.time}\n\nThank you for choosing Cleanify!`;

  // Send to customer
  if (booking.phone) {
    const formattedPhone = booking.phone.replace(/\s/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  // Also notify admin
  const adminMessage = `📊 STATUS UPDATED\n\nBooking ${booking.id}\nCustomer: ${booking.name}\nNew Status: ${booking.status}\nService: ${booking.subService}\n\nAdmin notification from Cleanify Dashboard.`;
  
  const adminEncoded = encodeURIComponent(adminMessage);
  const adminWhatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${adminEncoded}`;
  window.open(adminWhatsappUrl, '_blank');

  return { success: true, booking };
};
