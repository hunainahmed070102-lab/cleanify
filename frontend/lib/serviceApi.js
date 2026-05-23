// Services API operations
// Tries MongoDB API first, falls back to localStorage cache

const API_BASE = '/api';
const SERVICES_CACHE_KEY = 'cleanify_services';

// Get all services — tries API, falls back to localStorage
export const getAllServices = async () => {
  try {
    const response = await fetch(`${API_BASE}/services`);
    const result = await response.json();

    if (result.success && result.data?.length > 0) {
      // Cache to localStorage so public website can read it
      if (typeof window !== 'undefined') {
        localStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify(result.data));
        window.dispatchEvent(new StorageEvent('storage', { key: SERVICES_CACHE_KEY }));
      }
      return result.data;
    }

    console.error('Failed to fetch services:', result.error);
  } catch (error) {
    console.error('Error fetching services (API unavailable):', error);
  }

  // Fallback: read from localStorage cache
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(SERVICES_CACHE_KEY);
    if (cached) {
      try { return JSON.parse(cached); } catch (_) {}
    }
  }

  return [];
};

// Save/update a service — tries API, always updates localStorage cache
export const saveService = async (serviceData) => {
  // Always update localStorage cache immediately so public site reflects changes
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(SERVICES_CACHE_KEY);
      const services = cached ? JSON.parse(cached) : [];
      const idx = services.findIndex(s => s.id === serviceData.id);
      if (idx !== -1) {
        services[idx] = { ...services[idx], ...serviceData };
      } else {
        services.push(serviceData);
      }
      localStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify(services));
      // Notify other components
      window.dispatchEvent(new StorageEvent('storage', { key: SERVICES_CACHE_KEY }));
    } catch (_) {}
  }

  try {
    const response = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });

    const result = await response.json();

    if (result.success) {
      // Update cache with server response
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem(SERVICES_CACHE_KEY);
          const services = cached ? JSON.parse(cached) : [];
          const idx = services.findIndex(s => s.id === result.data.id);
          if (idx !== -1) {
            services[idx] = result.data;
          } else {
            services.push(result.data);
          }
          localStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify(services));
        } catch (_) {}
      }
      return result.data;
    }

    console.error('Failed to save service:', result.error);
    // Return the local data since we already saved it
    return serviceData;
  } catch (error) {
    console.error('Error saving service (API unavailable):', error);
    // Return local data — localStorage was already updated
    return serviceData;
  }
};
