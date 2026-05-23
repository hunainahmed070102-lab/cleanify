// Booking Service - localStorage operations

const STORAGE_KEY = 'cleanify_bookings';

// ─── ID Generator ────────────────────────────────────────────────────────────

const generateRandomString = (length) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like I, O, 0, 1
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateBookingId = () => {
  // Generate format: CLN-XXXXXX (6 random alphanumeric characters)
  const randomPart = generateRandomString(6);
  return `CLN-${randomPart}`;
};

// ─── Internal helpers ─────────────────────────────────────────────────────────
const readRaw = () => {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

const writeRaw = (bookings) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

// ─── Demo seed (only runs once when storage is empty) ─────────────────────────
const seedDemoBookings = () => {
  // Start with completely empty data - no demo bookings
  writeRaw([]);
  localStorage.setItem('cleanify_notifications', JSON.stringify([]));
  localStorage.setItem('cleanify_booking_counter', '1001');
  return [];
};

// ─── Public API ───────────────────────────────────────────────────────────────

/** Read all bookings. Seeds demo data on first run. */
export const getAllBookings = () => {
  if (typeof window === 'undefined') return [];
  const data = readRaw();
  return data ?? seedDemoBookings();
};

/** Prepend a new booking. */
export const saveBooking = (bookingData) => {
  if (typeof window === 'undefined') return;
  const bookings = getAllBookings();
  bookings.unshift(bookingData);
  writeRaw(bookings);
};

/** Update any fields on a booking. Returns the updated booking or null. */
export const updateBooking = (bookingId, updates) => {
  const bookings = getAllBookings();
  const idx = bookings.findIndex(b => b.id === bookingId);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], ...updates };
  writeRaw(bookings);
  return bookings[idx];
};

/** Update only the status field. */
export const updateBookingStatus = (bookingId, newStatus, adminNotes = '') => {
  const extra = adminNotes ? { adminNotes } : {};
  const updated = updateBooking(bookingId, { status: newStatus, ...extra });
  if (updated && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bookingStatusUpdated', {
      detail: { booking: updated, newStatus },
    }));
  }
  return !!updated;
};

/** Update payment status. */
export const updatePaymentStatus = (bookingId, paymentStatus) =>
  !!updateBooking(bookingId, { paymentStatus });

/** Assign a team. */
export const assignTeam = (bookingId, teamName) =>
  !!updateBooking(bookingId, { teamAssigned: teamName, status: 'Assigned to Team' });

/** Assign staff to a booking. */
export const assignStaff = (bookingId, staffData) => {
  const updated = updateBooking(bookingId, { 
    assignedStaff: staffData,
    status: 'Staff Assigned'
  });
  if (updated && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('staffAssigned', {
      detail: { booking: updated, staff: staffData },
    }));
  }
  return !!updated;
};

/** Delete a booking. */
export const deleteBooking = (bookingId) => {
  const bookings = getAllBookings();
  const filtered = bookings.filter(b => b.id !== bookingId);
  writeRaw(filtered);
  
  // Also remove from notifications
  if (typeof window !== 'undefined') {
    try {
      const notifs = JSON.parse(localStorage.getItem('cleanify_notifications') || '[]');
      const updatedNotifs = notifs.filter(n => n.booking?.id !== bookingId);
      localStorage.setItem('cleanify_notifications', JSON.stringify(updatedNotifs));
    } catch (_) {}
  }
  
  return true;
};

/** Find a single booking by ID. */
export const getBookingById = (bookingId) =>
  getAllBookings().find(b => b.id === bookingId) ?? null;

/** Compute stats from a pre-fetched list (avoids double localStorage read). */
export const computeStats = (bookings) => ({
  total:     bookings.length,
  pending:   bookings.filter(b => b.status === 'Pending').length,
  confirmed: bookings.filter(b => b.status === 'Confirmed').length,
  staffAssigned: bookings.filter(b => b.status === 'Staff Assigned').length,
  inProgress:bookings.filter(b => b.status === 'In Progress').length,
  completed: bookings.filter(b => b.status === 'Completed').length,
  cancelled: bookings.filter(b => b.status === 'Cancelled').length,
  revenue:   bookings
    .filter(b => ['Completed','Confirmed','Staff Assigned','In Progress'].includes(b.status))
    .reduce((s, b) => s + (b.totalPrice || 0), 0),
});

/** Convenience wrapper — reads once, computes stats. */
export const getBookingStats = () => computeStats(getAllBookings());
