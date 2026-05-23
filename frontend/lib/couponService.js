// Coupon service for admin portal
// Manages coupon codes stored in localStorage

const COUPONS_KEY = 'cleanify_coupons';

export const getAllCoupons = () => {
  if (typeof window === 'undefined') return [];
  const coupons = localStorage.getItem(COUPONS_KEY);
  return coupons ? JSON.parse(coupons) : [];
};

export const saveCoupon = (coupon) => {
  const coupons = getAllCoupons();
  const newCoupon = {
    ...coupon,
    id: coupon.id || `CPN${Date.now()}`,
    createdAt: coupon.createdAt || new Date().toISOString(),
    usageCount: coupon.usageCount || 0
  };
  coupons.push(newCoupon);
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
  return newCoupon;
};

export const updateCoupon = (id, updates) => {
  const coupons = getAllCoupons();
  const index = coupons.findIndex(c => c.id === id);
  if (index !== -1) {
    coupons[index] = { ...coupons[index], ...updates };
    localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
    return coupons[index];
  }
  return null;
};

export const deleteCoupon = (id) => {
  const coupons = getAllCoupons();
  const filtered = coupons.filter(c => c.id !== id);
  localStorage.setItem(COUPONS_KEY, JSON.stringify(filtered));
};

export const getCouponByCode = (code) => {
  const coupons = getAllCoupons();
  return coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
};

export const incrementCouponUsage = (id) => {
  const coupons = getAllCoupons();
  const index = coupons.findIndex(c => c.id === id);
  if (index !== -1) {
    coupons[index].usageCount = (coupons[index].usageCount || 0) + 1;
    localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
    return coupons[index];
  }
  return null;
};

export const generateCouponCode = (prefix = 'CLEAN') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = prefix;
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
