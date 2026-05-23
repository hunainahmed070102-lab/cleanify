// Authentication service for admin portal
// Secure localStorage-based authentication with session expiry

import { getAdminPassword } from './passwordService';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'cleanify2024' // Default password
};

// Session expiry time in milliseconds (8 hours)
const SESSION_EXPIRY = 8 * 60 * 60 * 1000;

export const login = (username, password) => {
  // Get the current admin password (could be default or custom)
  const currentPassword = getAdminPassword();
  
  if (username === ADMIN_CREDENTIALS.username && password === currentPassword) {
    const adminUser = {
      username: ADMIN_CREDENTIALS.username,
      loginTime: new Date().toISOString(),
      expiryTime: new Date(Date.now() + SESSION_EXPIRY).toISOString(),
      role: 'admin',
      sessionId: generateSessionId()
    };
    localStorage.setItem('adminAuth', JSON.stringify(adminUser));
    return { success: true, user: adminUser };
  }
  return { success: false, error: 'Invalid username or password' };
};

export const logout = () => {
  localStorage.removeItem('adminAuth');
  sessionStorage.clear();
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const auth = localStorage.getItem('adminAuth');
    
    console.log('Checking auth, localStorage value:', auth); // Debug log
    
    if (!auth) {
      console.log('No auth found in localStorage'); // Debug log
      return false;
    }
    
    const authData = JSON.parse(auth);
    
    // Check if session has expired
    if (authData.expiryTime) {
      const expiryTime = new Date(authData.expiryTime).getTime();
      const currentTime = Date.now();
      
      if (currentTime > expiryTime) {
        // Session expired, clear it
        console.log('Session expired'); // Debug log
        localStorage.removeItem('adminAuth');
        return false;
      }
    }
    
    const isValid = !!authData.username && !!authData.loginTime;
    console.log('Auth is valid:', isValid); // Debug log
    
    return isValid;
  } catch (error) {
    // Invalid auth data, clear it
    console.error('Error checking auth:', error); // Debug log
    localStorage.removeItem('adminAuth');
    return false;
  }
};

export const getAdminUser = () => {
  if (typeof window === 'undefined') return null;
  
  if (!isAuthenticated()) return null;
  
  try {
    const auth = localStorage.getItem('adminAuth');
    return auth ? JSON.parse(auth) : null;
  } catch (error) {
    return null;
  }
};

// Helper function to generate a simple session ID
function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${random}`;
}
