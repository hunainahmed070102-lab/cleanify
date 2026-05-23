const REVIEWS_KEY = 'cleanify_reviews';

// Default reviews
const defaultReviews = [
  {
    id: 'REV-001',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    name: 'Emma Roberts',
    handle: '@emmaroberts',
    review: 'Absolutely fantastic service! They handled our entire house clearance quickly and professionally.',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'REV-002',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200',
    name: 'Oliver Thompson',
    handle: '@oliverthompson',
    review: 'Very reliable and punctual. The removal service exceeded my expectations. Highly recommend!',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'REV-003',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
    name: 'Emily Watson',
    handle: '@emilywatson',
    review: 'I use Cleanify for all my property needs. Consistent quality across all their services.',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'REV-004',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=200',
    name: 'James Mitchell',
    handle: '@jamesmitchell',
    review: 'Highly professional team. They handle our office cleaning and waste disposal. Amazing service!',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'REV-005',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
    name: 'Sophie Anderson',
    handle: '@sophieanderson',
    review: 'Amazing end of tenancy cleaning and clearance service. They went above and beyond expectations.',
    rating: 5,
    createdAt: new Date().toISOString()
  }
];

export const getReviews = () => {
  if (typeof window === 'undefined') return defaultReviews;

  const stored = localStorage.getItem(REVIEWS_KEY);
  if (!stored) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(defaultReviews));
    return defaultReviews;
  }

  return JSON.parse(stored);
};

// Get only visible reviews (for public website)
export const getVisibleReviews = () => {
  const all = getReviews();
  return all.filter(r => r.visible !== false);
};

export const saveReviews = (reviews) => {
  if (typeof window === 'undefined') return false;
  
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new CustomEvent('reviewsUpdated'));
  return true;
};

export const addReview = (reviewData) => {
  const reviews = getReviews();
  const newReview = {
    id: `REV-${String(reviews.length + 1).padStart(3, '0')}`,
    ...reviewData,
    rating: reviewData.rating || 5,
    createdAt: new Date().toISOString()
  };
  
  reviews.unshift(newReview); // Add to beginning
  saveReviews(reviews);
  return newReview;
};

export const updateReview = (reviewId, updatedData) => {
  const reviews = getReviews();
  const index = reviews.findIndex(r => r.id === reviewId);
  
  if (index !== -1) {
    reviews[index] = { ...reviews[index], ...updatedData };
    saveReviews(reviews);
    return true;
  }
  return false;
};

export const deleteReview = (reviewId) => {
  const reviews = getReviews();
  const filtered = reviews.filter(r => r.id !== reviewId);
  saveReviews(filtered);
  return true;
};

export const getReviewById = (reviewId) => {
  const reviews = getReviews();
  return reviews.find(r => r.id === reviewId);
};
