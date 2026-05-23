// Complete pricing data structure for all Cleanify services
// This serves as the default/initial data structure
// Prices adjusted for competitive London rates

export const defaultPricingData = [
  {
    id: 'cleaning-services',
    name: 'Cleaning Services',
    basePrice: 45,
    subServices: [
      { name: 'Home Cleaning', price: 45, isActive: true },
      { name: 'Office Cleaning', price: 55, isActive: true },
      { name: 'Deep Cleaning', price: 85, isActive: true },
      { name: 'Carpet Cleaning', price: 40, isActive: true },
      { name: 'Window Cleaning', price: 35, isActive: true },
      { name: 'End of Tenancy Cleaning', price: 120, isActive: true },
      { name: 'Bathroom Cleaning', price: 30, isActive: true },
      { name: 'Kitchen Cleaning', price: 35, isActive: true },
    ]
  },
  {
    id: 'removal-services',
    name: 'Removal Services',
    basePrice: 75,
    subServices: [
      { name: 'Furniture Removal', price: 75, isActive: true },
      { name: 'Sofa Removal', price: 45, isActive: true },
      { name: 'Appliance Removal', price: 40, isActive: true },
      { name: 'House Moving Assistance', price: 150, isActive: true },
      { name: 'Office Relocation', price: 200, isActive: true },
      { name: 'Single Item Removal', price: 30, isActive: true },
      { name: 'Heavy Item Removal', price: 65, isActive: true },
    ]
  },
  {
    id: 'disposal-services',
    name: 'Disposal Services',
    basePrice: 50,
    subServices: [
      { name: 'Rubbish Collection', price: 50, isActive: true },
      { name: 'Junk Removal', price: 60, isActive: true },
      { name: 'Garden Waste Disposal', price: 45, isActive: true },
      { name: 'Old Furniture Disposal', price: 55, isActive: true },
      { name: 'Construction Waste Disposal', price: 90, isActive: true },
      { name: 'Appliance Disposal', price: 35, isActive: true },
      { name: 'General Waste Disposal', price: 40, isActive: true },
    ]
  },
  {
    id: 'clearance-services',
    name: 'Clearance Services',
    basePrice: 65,
    subServices: [
      { name: 'House Clearance', price: 150, isActive: true },
      { name: 'Garage Clearance', price: 75, isActive: true },
      { name: 'Loft Clearance', price: 65, isActive: true },
      { name: 'Basement Clearance', price: 85, isActive: true },
      { name: 'Estate Clearance', price: 250, isActive: true },
      { name: 'Office Clearance', price: 175, isActive: true },
      { name: 'Storage Room Clearance', price: 60, isActive: true },
    ]
  },
  {
    id: 'moving-services',
    name: 'Moving Services',
    basePrice: 90,
    subServices: [
      { name: 'House Moving', price: 200, isActive: true },
      { name: 'Flat Moving', price: 150, isActive: true },
      { name: 'Office Moving', price: 250, isActive: true },
      { name: 'Packing Assistance', price: 75, isActive: true },
      { name: 'Small Move Service', price: 90, isActive: true },
    ]
  },
  {
    id: 'commercial-services',
    name: 'Commercial Services',
    basePrice: 100,
    subServices: [
      { name: 'Commercial Cleaning', price: 100, isActive: true },
      { name: 'Office Cleaning', price: 75, isActive: true },
      { name: 'Shop Cleaning', price: 65, isActive: true },
      { name: 'Warehouse Cleaning', price: 125, isActive: true },
      { name: 'Commercial Waste Removal', price: 90, isActive: true },
    ]
  },
];

// Initialize pricing data in localStorage if not exists
export const initializePricingData = () => {
  if (typeof window === 'undefined') return;
  
  const existing = localStorage.getItem('cleanify_services');
  if (!existing) {
    localStorage.setItem('cleanify_services', JSON.stringify(defaultPricingData));
  }
};

// Get all services from localStorage
export const getAllPricingData = () => {
  if (typeof window === 'undefined') return defaultPricingData;
  
  const saved = localStorage.getItem('cleanify_services');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing pricing data:', e);
    }
  }
  return defaultPricingData;
};

// Save pricing data to localStorage
export const savePricingData = (data) => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem('cleanify_services', JSON.stringify(data));
    // Trigger storage event for other components
    window.dispatchEvent(new StorageEvent('storage', { 
      key: 'cleanify_services',
      newValue: JSON.stringify(data)
    }));
    return true;
  } catch (e) {
    console.error('Error saving pricing data:', e);
    return false;
  }
};

// Update a specific sub-service price
export const updateSubServicePrice = (categoryId, subServiceName, newPrice, isActive) => {
  const data = getAllPricingData();
  const categoryIndex = data.findIndex(cat => cat.id === categoryId);
  
  if (categoryIndex === -1) return false;
  
  const subServiceIndex = data[categoryIndex].subServices.findIndex(
    sub => sub.name === subServiceName
  );
  
  if (subServiceIndex === -1) return false;
  
  data[categoryIndex].subServices[subServiceIndex] = {
    ...data[categoryIndex].subServices[subServiceIndex],
    price: newPrice !== undefined ? newPrice : data[categoryIndex].subServices[subServiceIndex].price,
    isActive: isActive !== undefined ? isActive : data[categoryIndex].subServices[subServiceIndex].isActive,
  };
  
  return savePricingData(data);
};

// Update category base price
export const updateCategoryBasePrice = (categoryId, newBasePrice) => {
  const data = getAllPricingData();
  const categoryIndex = data.findIndex(cat => cat.id === categoryId);
  
  if (categoryIndex === -1) return false;
  
  data[categoryIndex].basePrice = newBasePrice;
  
  return savePricingData(data);
};
