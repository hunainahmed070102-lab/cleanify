// Password management service
// Stores admin password separately from auth session

const PASSWORD_KEY = 'cleanify_admin_password';
const DEFAULT_PASSWORD = 'cleanify2024';

// Get the current admin password
export const getAdminPassword = () => {
  if (typeof window === 'undefined') return DEFAULT_PASSWORD;
  
  try {
    const stored = localStorage.getItem(PASSWORD_KEY);
    return stored || DEFAULT_PASSWORD;
  } catch (error) {
    return DEFAULT_PASSWORD;
  }
};

// Update the admin password
export const updateAdminPassword = (newPassword) => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(PASSWORD_KEY, newPassword);
    return true;
  } catch (error) {
    return false;
  }
};

// Verify if a password matches the current admin password
export const verifyPassword = (password) => {
  return password === getAdminPassword();
};

// Reset to default password (for testing/recovery)
export const resetToDefaultPassword = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(PASSWORD_KEY);
    return true;
  } catch (error) {
    return false;
  }
};
