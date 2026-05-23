// Settings service for managing site-wide settings
// Shared between admin portal and public website

const SETTINGS_KEY = 'cleanify_admin_settings';

const defaultSettings = {
    siteName: 'Cleanify',
    currency: '£',
    businessEmail: 'info@cleanify.co.uk',
    businessPhone: '+44 20 1234 5678',
    businessAddress: '123 London Road, London, UK',
    enableEmailNotifications: true,
    enableWhatsAppNotifications: true,
    autoAssignStatus: 'Pending',
    paymentTerms: 'Payment is due after service completion. We accept cash, card, and bank transfer.',
    adminName: 'Admin',
    adminEmail: 'admin@cleanify.co.uk'
};

// Get settings from localStorage
export const getSettings = () => {
    if (typeof window === 'undefined') return defaultSettings;
    
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            return { ...defaultSettings, ...JSON.parse(saved) };
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
    
    return defaultSettings;
};

// Save settings to localStorage
export const saveSettings = (settings) => {
    if (typeof window === 'undefined') return false;
    
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
};

// Listen for settings changes (for real-time updates)
export const onSettingsChange = (callback) => {
    if (typeof window === 'undefined') return () => {};
    
    const handleStorage = (e) => {
        if (e.key === SETTINGS_KEY) {
            callback(getSettings());
        }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
};
