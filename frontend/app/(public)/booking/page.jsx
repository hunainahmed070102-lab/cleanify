'use client'
import { useState, useEffect } from 'react';
import { notifyNewBooking } from '@/lib/notificationService';
import { saveBooking, generateBookingId } from '@/lib/bookingService';
import { getCouponByCode, incrementCouponUsage } from '@/lib/couponService';
import Link from 'next/link';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const serviceCategories = {
    'Cleaning Services': {
        subServices: ['1 Bedroom Flat', '2 Bedroom Flat', '3 Bedroom Flat', 'Deep Cleaning', 'End of Tenancy Cleaning', 'Carpet Cleaning', 'Window Cleaning', 'Office Cleaning'],
        basePrice: 175,
        // Fixed prices per bedroom for flat/unit
        bedroomPrices: { 1: 175, 2: 245, 3: 345 }
    },
    'Removal Services': {
        subServices: ['Furniture Removal', 'Sofa Removal', 'Appliance Removal', 'House Moving Assistance', 'Office Relocation'],
        basePrice: 120
    },
    'Disposal Services': {
        subServices: ['Rubbish Collection', 'Junk Removal', 'Garden Waste Disposal', 'Old Furniture Disposal', 'Construction Waste Disposal'],
        basePrice: 85
    },
    'Clearance Services': {
        subServices: ['House Clearance', 'Garage Clearance', 'Loft Clearance', 'Basement Clearance', 'Estate Clearance'],
        basePrice: 150
    },
    'Moving Services': {
        subServices: ['Residential Moving', 'Commercial Moving', 'Packing Services', 'Storage Solutions', 'International Moving'],
        basePrice: 200
    },
    'Commercial Services': {
        subServices: ['Office Cleaning', 'Property Maintenance', 'Facility Management', 'Waste Management', 'Building Services'],
        basePrice: 180
    }
};

const emptyForm = {
    serviceCategory: '', subService: '',
    propertyType: 'Flat', rooms: 1, bathrooms: 1, area: '', itemQuantity: 1, notes: '',
    date: '', time: '',
    name: '', phone: '', email: '', address: '', postcode: '', whatsapp: '',
    couponCode: '', appliedCoupon: null
};

export default function BookingPage() {
    useEffect(() => {
        document.title = "Cleanify | Book a Service";
    }, []);
    
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState(emptyForm);
    const [bookingSubmitted, setBookingSubmitted] = useState(false);
    const [bookingId, setBookingId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [appliedCouponData, setAppliedCouponData] = useState(null);

    const calculatePrice = () => {
        if (!bookingData.serviceCategory) return { basePrice: 0, roomCharges: 0, subtotal: 0, discount: 0, total: 0 };
        const category = serviceCategories[bookingData.serviceCategory];
        
        let basePrice;
        let roomCharges = 0;

        // Cleaning Services: fixed prices per bedroom (1 bed=£175, 2 bed=£245, 3 bed=£345)
        if (bookingData.serviceCategory === 'Cleaning Services' && category.bedroomPrices) {
            const rooms = Math.min(bookingData.rooms, 3); // cap at 3 for fixed pricing
            basePrice = category.bedroomPrices[rooms] || category.bedroomPrices[3];
        } else {
            basePrice = category?.basePrice || 99;
            roomCharges = bookingData.rooms > 1 ? (bookingData.rooms - 1) * 40 : 0;
        }

        const subtotal = basePrice + roomCharges;
        
        let discount = 0;
        if (appliedCouponData) {
            if (appliedCouponData.discountType === 'percentage') {
                discount = Math.round(subtotal * (appliedCouponData.discountValue / 100));
            } else if (appliedCouponData.discountType === 'fixed') {
                discount = appliedCouponData.discountValue;
            }
        }
        
        const total = Math.max(0, subtotal - discount);
        return { basePrice, roomCharges, subtotal, discount, total };
    };

    const pricing = calculatePrice();

    const handleApplyCoupon = async () => {
        // Trim and uppercase the code
        const code = bookingData.couponCode.trim().toUpperCase();
        
        // Don't show error if field is empty - coupon is optional
        if (!code) {
            return;
        }

        // Get coupon from admin-created coupons (case-insensitive)
        const coupon = getCouponByCode(code);
        
        if (!coupon) {
            setCouponError('Invalid coupon code');
            setCouponSuccess('');
            setBookingData({ ...bookingData, appliedCoupon: null });
            setAppliedCouponData(null);
            return;
        }

        // Check if coupon is active
        if (!coupon.isActive) {
            setCouponError('This coupon is no longer active');
            setCouponSuccess('');
            setBookingData({ ...bookingData, appliedCoupon: null });
            setAppliedCouponData(null);
            return;
        }

        // Check if coupon has expired
        if (coupon.expiryDate) {
            const expiryDate = new Date(coupon.expiryDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (expiryDate < today) {
                setCouponError('This coupon has expired');
                setCouponSuccess('');
                setBookingData({ ...bookingData, appliedCoupon: null });
                setAppliedCouponData(null);
                return;
            }
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            setCouponError('This coupon has reached its usage limit');
            setCouponSuccess('');
            setBookingData({ ...bookingData, appliedCoupon: null });
            setAppliedCouponData(null);
            return;
        }

        // Apply the coupon
        setBookingData({ ...bookingData, appliedCoupon: code });
        setAppliedCouponData(coupon);
        setCouponSuccess('Coupon applied successfully!');
        setCouponError('');
    };

    const handleRemoveCoupon = () => {
        setBookingData({ ...bookingData, couponCode: '', appliedCoupon: null });
        setAppliedCouponData(null);
        setCouponError('');
        setCouponSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const newId = generateBookingId();
            const booking = { 
                id: newId, 
                ...bookingData, 
                status: 'Pending', 
                createdAt: new Date().toISOString(), 
                totalPrice: pricing.total,
                discount: pricing.discount,
                subtotal: pricing.subtotal,
                couponCode: bookingData.appliedCoupon || '',
                couponId: appliedCouponData?.id || null
            };
            
            saveBooking(booking);
            
            // Increment coupon usage count if coupon was applied
            if (appliedCouponData?.id) {
                incrementCouponUsage(appliedCouponData.id);
            }
            
            // Try to send to API but don't wait for it
            fetch('/api/bookings', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(booking) 
            }).catch(() => {});
            
            // Notify in background
            notifyNewBooking(booking).catch(() => {});
            
            setBookingId(newId);
            setBookingSubmitted(true);
        } catch (error) {
            console.error('Booking error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (bookingSubmitted) {
        return (
            <section className="min-h-screen bg-slate-50 py-8 px-4 pt-24 md:pt-28">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT SIDE - SUCCESS MESSAGE */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
                                <div className="w-24 h-24 mx-auto mb-6 bg-green-600 rounded-full flex items-center justify-center">
                                    <CheckCircle size={48} className="text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-800 mb-3 text-center">Booking Confirmed Successfully</h2>
                                <p className="text-slate-600 mb-8 text-center">Your booking has been received successfully. Please save your tracking ID to check your booking status.</p>
                                <div className="bg-green-50 rounded-xl p-6 mb-6 border border-green-200">
                                    <p className="text-sm text-slate-600 mb-2 font-semibold text-center">Tracking ID</p>
                                    <p className="text-2xl font-bold text-green-600 font-mono text-center">{bookingId}</p>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Link href={`/track-booking?trackingId=${bookingId}`} className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                                        Track Status
                                    </Link>
                                    <Link href="/" className="px-8 py-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors">
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE - FINAL BILL SUMMARY */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
                                    <h3 className="text-lg font-bold mb-4">Final Bill Summary</h3>
                                    <div className="space-y-3 text-sm mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-green-100">Base Price</span>
                                            <span className="font-semibold">£{pricing.basePrice}</span>
                                        </div>
                                        {pricing.roomCharges > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-green-100">Room Charges</span>
                                                <span className="font-semibold">£{pricing.roomCharges}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t border-white/20">
                                            <span className="text-green-100">Subtotal</span>
                                            <span className="font-semibold">£{pricing.subtotal}</span>
                                        </div>
                                        {pricing.discount > 0 && (
                                            <div className="flex justify-between text-green-200">
                                                <span>Coupon Discount</span>
                                                <span className="font-semibold">-£{pricing.discount}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t border-white/20 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold">Total Paid</span>
                                            <span className="text-3xl font-bold">£{pricing.total}</span>
                                        </div>
                                        {pricing.discount > 0 && (
                                            <p className="text-xs text-green-200 mt-3 text-center">You saved £{pricing.discount} with coupon!</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const inputClass = "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-600 outline-none transition-all bg-white text-slate-800";
    const labelClass = "block text-sm font-semibold text-slate-700 mb-2";

    return (
        <section className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-12 md:py-16 pt-24 md:pt-28">

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            {currentStep === 1 && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <h2 className="text-xl font-bold text-slate-800 mb-6">Step 1: Select Service</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className={labelClass}>Service Category *</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {Object.keys(serviceCategories).map((cat) => (
                                                    <button key={cat} type="button" onClick={() => setBookingData({ ...bookingData, serviceCategory: cat, subService: '' })}
                                                        className={`p-4 border-2 rounded-lg text-sm font-semibold transition-all ${bookingData.serviceCategory === cat ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-200 bg-white text-slate-700 hover:border-green-600 hover:bg-green-50'}`}>
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {bookingData.serviceCategory && (
                                            <div>
                                                <label className={labelClass}>Sub-Service *</label>
                                                <select
                                                    value={bookingData.subService}
                                                    onChange={(e) => setBookingData({ ...bookingData, subService: e.target.value })}
                                                    className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-600 outline-none transition-all bg-white text-slate-800 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23475569%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
                                                    required
                                                >
                                                    <option value="">Select a sub-service</option>
                                                    {serviceCategories[bookingData.serviceCategory].subServices.map((sub) => (
                                                        <option key={sub} value={sub}>{sub}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <button type="button" onClick={() => setCurrentStep(2)} disabled={!bookingData.serviceCategory || !bookingData.subService}
                                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                            Next <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <h2 className="text-xl font-bold text-slate-800 mb-6">Step 2: Service Details & Date</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Property Type - Show for Cleaning, Removal, and Clearance Services */}
                                        {(bookingData.serviceCategory === 'Cleaning Services' || 
                                          bookingData.serviceCategory === 'Removal Services' || 
                                          bookingData.serviceCategory === 'Clearance Services') && (
                                            <div>
                                                <label className={labelClass}>Property Type *</label>
                                                <select 
                                                    required 
                                                    value={bookingData.propertyType} 
                                                    onChange={(e) => setBookingData({ ...bookingData, propertyType: e.target.value })} 
                                                    className={inputClass}
                                                >
                                                    <option value="House">House</option>
                                                    <option value="Flat">Flat</option>
                                                    <option value="Apartment">Apartment</option>
                                                    <option value="Office">Office</option>
                                                    <option value="Shop">Shop</option>
                                                </select>
                                            </div>
                                        )}
                                        
                                        {/* Cleaning Services Fields */}
                                        {bookingData.serviceCategory === 'Cleaning Services' && (
                                            <>
                                                <div>
                                                    <label className={labelClass}>Number of Rooms *</label>
                                                    <input 
                                                        type="number" 
                                                        required 
                                                        min="1" 
                                                        max="20" 
                                                        value={bookingData.rooms} 
                                                        onChange={(e) => setBookingData({ ...bookingData, rooms: parseInt(e.target.value) || 1 })} 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Bathrooms</label>
                                                    <input 
                                                        type="number" 
                                                        min="1" 
                                                        max="10" 
                                                        value={bookingData.bathrooms} 
                                                        onChange={(e) => setBookingData({ ...bookingData, bathrooms: parseInt(e.target.value) || 1 })} 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Property Size (sq ft)</label>
                                                    <input 
                                                        type="number" 
                                                        value={bookingData.area} 
                                                        onChange={(e) => setBookingData({ ...bookingData, area: e.target.value })} 
                                                        placeholder="Optional" 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                            </>
                                        )}
                                        
                                        {/* Removal Services Fields */}
                                        {bookingData.serviceCategory === 'Removal Services' && (
                                            <>
                                                <div>
                                                    <label className={labelClass}>Item Type *</label>
                                                    <input 
                                                        type="text" 
                                                        required 
                                                        value={bookingData.itemType || ''} 
                                                        onChange={(e) => setBookingData({ ...bookingData, itemType: e.target.value })} 
                                                        placeholder="e.g., Sofa, Furniture, Appliance" 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Item Quantity *</label>
                                                    <input 
                                                        type="number" 
                                                        required 
                                                        min="1" 
                                                        value={bookingData.itemQuantity} 
                                                        onChange={(e) => setBookingData({ ...bookingData, itemQuantity: parseInt(e.target.value) || 1 })} 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Item Size</label>
                                                    <select 
                                                        value={bookingData.itemSize || 'Medium'} 
                                                        onChange={(e) => setBookingData({ ...bookingData, itemSize: e.target.value })} 
                                                        className={inputClass}
                                                    >
                                                        <option value="Small">Small</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="Large">Large</option>
                                                        <option value="Extra Large">Extra Large</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                        
                                        {/* Disposal Services Fields */}
                                        {bookingData.serviceCategory === 'Disposal Services' && (
                                            <>
                                                <div>
                                                    <label className={labelClass}>Waste Type *</label>
                                                    <select 
                                                        required 
                                                        value={bookingData.wasteType || 'General Waste'} 
                                                        onChange={(e) => setBookingData({ ...bookingData, wasteType: e.target.value })} 
                                                        className={inputClass}
                                                    >
                                                        <option value="General Waste">General Waste</option>
                                                        <option value="Garden Waste">Garden Waste</option>
                                                        <option value="Construction Waste">Construction Waste</option>
                                                        <option value="Furniture">Furniture</option>
                                                        <option value="Electronic Waste">Electronic Waste</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Quantity (bags/items) *</label>
                                                    <input 
                                                        type="number" 
                                                        required 
                                                        min="1" 
                                                        value={bookingData.itemQuantity} 
                                                        onChange={(e) => setBookingData({ ...bookingData, itemQuantity: parseInt(e.target.value) || 1 })} 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Collection Location *</label>
                                                    <input 
                                                        type="text" 
                                                        required 
                                                        value={bookingData.collectionLocation || ''} 
                                                        onChange={(e) => setBookingData({ ...bookingData, collectionLocation: e.target.value })} 
                                                        placeholder="e.g., Front door, Garden, Driveway" 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                            </>
                                        )}
                                        
                                        {/* Clearance Services Fields */}
                                        {bookingData.serviceCategory === 'Clearance Services' && (
                                            <>
                                                <div>
                                                    <label className={labelClass}>Area / Room Count *</label>
                                                    <input 
                                                        type="number" 
                                                        required 
                                                        min="1" 
                                                        value={bookingData.rooms} 
                                                        onChange={(e) => setBookingData({ ...bookingData, rooms: parseInt(e.target.value) || 1 })} 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Clearance Type *</label>
                                                    <select 
                                                        required 
                                                        value={bookingData.clearanceType || 'Full Clearance'} 
                                                        onChange={(e) => setBookingData({ ...bookingData, clearanceType: e.target.value })} 
                                                        className={inputClass}
                                                    >
                                                        <option value="Full Clearance">Full Clearance</option>
                                                        <option value="Partial Clearance">Partial Clearance</option>
                                                        <option value="Single Room">Single Room</option>
                                                        <option value="Multiple Rooms">Multiple Rooms</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                        
                                        {/* Moving Services Fields */}
                                        {bookingData.serviceCategory === 'Moving Services' && (
                                            <>
                                                <div>
                                                    <label className={labelClass}>Moving From *</label>
                                                    <input 
                                                        type="text" 
                                                        required 
                                                        value={bookingData.movingFrom || ''} 
                                                        onChange={(e) => setBookingData({ ...bookingData, movingFrom: e.target.value })} 
                                                        placeholder="Current address" 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Moving To *</label>
                                                    <input 
                                                        type="text" 
                                                        required 
                                                        value={bookingData.movingTo || ''} 
                                                        onChange={(e) => setBookingData({ ...bookingData, movingTo: e.target.value })} 
                                                        placeholder="New address" 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Number of Rooms *</label>
                                                    <input 
                                                        type="number" 
                                                        required 
                                                        min="1" 
                                                        value={bookingData.rooms} 
                                                        onChange={(e) => setBookingData({ ...bookingData, rooms: parseInt(e.target.value) || 1 })} 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Estimated Load Size</label>
                                                    <select 
                                                        value={bookingData.loadSize || 'Medium'} 
                                                        onChange={(e) => setBookingData({ ...bookingData, loadSize: e.target.value })} 
                                                        className={inputClass}
                                                    >
                                                        <option value="Small">Small (1-2 rooms)</option>
                                                        <option value="Medium">Medium (3-4 rooms)</option>
                                                        <option value="Large">Large (5+ rooms)</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                        
                                        {/* Commercial Services Fields */}
                                        {bookingData.serviceCategory === 'Commercial Services' && (
                                            <>
                                                <div>
                                                    <label className={labelClass}>Business Type *</label>
                                                    <input 
                                                        type="text" 
                                                        required 
                                                        value={bookingData.businessType || ''} 
                                                        onChange={(e) => setBookingData({ ...bookingData, businessType: e.target.value })} 
                                                        placeholder="e.g., Office, Retail, Restaurant" 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Service Area (sq ft) *</label>
                                                    <input 
                                                        type="number" 
                                                        required 
                                                        value={bookingData.area} 
                                                        onChange={(e) => setBookingData({ ...bookingData, area: e.target.value })} 
                                                        placeholder="Total area" 
                                                        className={inputClass} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Service Frequency</label>
                                                    <select 
                                                        value={bookingData.frequency || 'One-time'} 
                                                        onChange={(e) => setBookingData({ ...bookingData, frequency: e.target.value })} 
                                                        className={inputClass}
                                                    >
                                                        <option value="One-time">One-time</option>
                                                        <option value="Weekly">Weekly</option>
                                                        <option value="Bi-weekly">Bi-weekly</option>
                                                        <option value="Monthly">Monthly</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                        
                                        {/* Date and Time - Common for all services */}
                                        <div>
                                            <label className={labelClass}>Preferred Date *</label>
                                            <input 
                                                type="date" 
                                                required 
                                                min={new Date().toISOString().split('T')[0]} 
                                                value={bookingData.date} 
                                                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })} 
                                                className={inputClass} 
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Preferred Time *</label>
                                            <input 
                                                type="time" 
                                                required 
                                                value={bookingData.time} 
                                                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })} 
                                                className={inputClass} 
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Extra Notes - Common for all services */}
                                    <div className="mt-4">
                                        <label className={labelClass}>Extra Notes</label>
                                        <textarea value={bookingData.notes} onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })} placeholder="Any special requirements..." rows={3} className={`${inputClass} resize-none`} />
                                    </div>
                                    
                                    <div className="mt-6 flex justify-between">
                                        <button type="button" onClick={() => setCurrentStep(1)} className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2">
                                            <ChevronLeft size={18} /> Back
                                        </button>
                                        <button type="button" onClick={() => setCurrentStep(3)} disabled={!bookingData.date || !bookingData.time}
                                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                            Next <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <h2 className="text-xl font-bold text-slate-800 mb-6">Step 3: Customer Info</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div><label className={labelClass}>Full Name *</label>
                                            <input type="text" required value={bookingData.name} onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })} placeholder="John Smith" className={inputClass} />
                                        </div>
                                        <div><label className={labelClass}>Phone Number *</label>
                                            <input type="tel" required value={bookingData.phone} onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })} placeholder="+44 7123 456789" className={inputClass} />
                                        </div>
                                        <div className="sm:col-span-2"><label className={labelClass}>Email Address *</label>
                                            <input type="email" required value={bookingData.email} onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })} placeholder="john@example.com" className={inputClass} />
                                        </div>
                                        <div className="sm:col-span-2"><label className={labelClass}>Full Address *</label>
                                            <input type="text" required value={bookingData.address} onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })} placeholder="123 Main St, London" className={inputClass} />
                                        </div>
                                        <div><label className={labelClass}>Postcode *</label>
                                            <input type="text" required value={bookingData.postcode} onChange={(e) => setBookingData({ ...bookingData, postcode: e.target.value })} placeholder="SW1A 1AA" className={inputClass} />
                                        </div>
                                        <div><label className={labelClass}>WhatsApp</label>
                                            <input type="tel" value={bookingData.whatsapp} onChange={(e) => setBookingData({ ...bookingData, whatsapp: e.target.value })} placeholder="If different" className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-between">
                                        <button type="button" onClick={() => setCurrentStep(2)} className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2">
                                            <ChevronLeft size={18} /> Back
                                        </button>
                                        <button type="button" onClick={() => setCurrentStep(4)} disabled={!bookingData.name || !bookingData.phone || !bookingData.email || !bookingData.address || !bookingData.postcode}
                                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                            Next <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <h2 className="text-xl font-bold text-slate-800 mb-6">Step 4: Review & Confirm</h2>
                                    <div className="space-y-4 text-sm">
                                        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                                            <div>
                                                <p className="text-slate-500 mb-1">Service</p>
                                                <p className="font-semibold text-slate-800">{bookingData.subService}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Category</p>
                                                <p className="font-semibold text-slate-800">{bookingData.serviceCategory}</p>
                                            </div>
                                            
                                            {/* Property Type for relevant services */}
                                            {(bookingData.serviceCategory === 'Cleaning Services' || 
                                              bookingData.serviceCategory === 'Removal Services' || 
                                              bookingData.serviceCategory === 'Clearance Services') && (
                                                <div>
                                                    <p className="text-slate-500 mb-1">Property Type</p>
                                                    <p className="font-semibold text-slate-800">{bookingData.propertyType}</p>
                                                </div>
                                            )}
                                            
                                            {/* Rooms for relevant services */}
                                            {(bookingData.serviceCategory === 'Cleaning Services' || 
                                              bookingData.serviceCategory === 'Clearance Services' || 
                                              bookingData.serviceCategory === 'Moving Services') && (
                                                <div>
                                                    <p className="text-slate-500 mb-1">Rooms</p>
                                                    <p className="font-semibold text-slate-800">{bookingData.rooms}</p>
                                                </div>
                                            )}
                                            
                                            <div>
                                                <p className="text-slate-500 mb-1">Date</p>
                                                <p className="font-semibold text-slate-800">{new Date(bookingData.date).toLocaleDateString('en-GB')}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Time</p>
                                                <p className="font-semibold text-slate-800">{bookingData.time}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Customer</p>
                                                <p className="font-semibold text-slate-800">{bookingData.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Phone</p>
                                                <p className="font-semibold text-slate-800">{bookingData.phone}</p>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-between gap-3">
                                            <button type="button" onClick={() => setCurrentStep(3)} className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2">
                                                <ChevronLeft size={18} /> Back
                                            </button>
                                            <button type="submit" disabled={submitting} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                                                {submitting ? 'Processing...' : 'Confirm Booking'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* RIGHT SIDE - LIVE BILL PREVIEW */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Booking Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">Service</span>
                                        <span className="font-semibold text-slate-800 text-right">
                                            {bookingData.subService || bookingData.serviceCategory || <span className="text-slate-400">Not selected</span>}
                                        </span>
                                    </div>
                                    
                                    {/* Show Property Type for relevant services */}
                                    {(bookingData.serviceCategory === 'Cleaning Services' || 
                                      bookingData.serviceCategory === 'Removal Services' || 
                                      bookingData.serviceCategory === 'Clearance Services') && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">Property Type</span>
                                            <span className="font-semibold text-slate-800">
                                                {bookingData.propertyType || <span className="text-slate-400">Not selected</span>}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Show Rooms for Cleaning, Clearance, and Moving Services */}
                                    {(bookingData.serviceCategory === 'Cleaning Services' || 
                                      bookingData.serviceCategory === 'Clearance Services' || 
                                      bookingData.serviceCategory === 'Moving Services') && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">Rooms</span>
                                            <span className="font-semibold text-slate-800">
                                                {bookingData.rooms || <span className="text-slate-400">Not selected</span>}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Show Bathrooms for Cleaning Services only */}
                                    {bookingData.serviceCategory === 'Cleaning Services' && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">Bathrooms</span>
                                            <span className="font-semibold text-slate-800">
                                                {bookingData.bathrooms || <span className="text-slate-400">Not selected</span>}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Show Area for Cleaning and Commercial Services */}
                                    {(bookingData.serviceCategory === 'Cleaning Services' || 
                                      bookingData.serviceCategory === 'Commercial Services') && bookingData.area && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">Area (sq ft)</span>
                                            <span className="font-semibold text-slate-800">{bookingData.area}</span>
                                        </div>
                                    )}
                                    
                                    {/* Show Item Quantity for Removal and Disposal Services */}
                                    {(bookingData.serviceCategory === 'Removal Services' || 
                                      bookingData.serviceCategory === 'Disposal Services') && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">Quantity</span>
                                            <span className="font-semibold text-slate-800">
                                                {bookingData.itemQuantity || <span className="text-slate-400">Not selected</span>}
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">Date</span>
                                        <span className="font-semibold text-slate-800">
                                            {bookingData.date ? new Date(bookingData.date).toLocaleDateString('en-GB') : <span className="text-slate-400">Not selected</span>}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600">Time</span>
                                        <span className="font-semibold text-slate-800">
                                            {bookingData.time || <span className="text-slate-400">Not selected</span>}
                                        </span>
                                    </div>
                                </div>
                                {!bookingData.serviceCategory && (
                                    <p className="text-slate-400 text-sm text-center py-8">Select a service to see your booking details</p>
                                )}
                            </div>

                            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
                                <h3 className="text-lg font-bold mb-4">Price Breakdown</h3>
                                {pricing.total > 0 ? (
                                    <>
                                        <div className="space-y-3 text-sm mb-4">
                                            <div className="flex justify-between">
                                                <span className="text-green-100">Base Price</span>
                                                <span className="font-semibold">£{pricing.basePrice}</span>
                                            </div>
                                            {pricing.roomCharges > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-green-100">Room Charges</span>
                                                    <span className="font-semibold">£{pricing.roomCharges}</span>
                                                </div>
                                            )}
                                            {pricing.subtotal > 0 && (
                                                <div className="flex justify-between pt-2 border-t border-white/20">
                                                    <span className="text-green-100">Subtotal</span>
                                                    <span className="font-semibold">£{pricing.subtotal}</span>
                                                </div>
                                            )}
                                            {pricing.discount > 0 && (
                                                <div className="flex justify-between text-green-200">
                                                    <span>Coupon Discount</span>
                                                    <span className="font-semibold">-£{pricing.discount}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-t border-white/20 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold">Estimated Total</span>
                                                <span className="text-3xl font-bold">£{pricing.total}</span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-xs text-green-100 text-center mt-4 leading-relaxed">Estimated price based on your booking details. No work will begin until the final quote is confirmed with you.</p>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-green-100 text-sm">Complete the form to see your price</p>
                                    </div>
                                )}
                            </div>

                            {/* Coupon Code Section - Outside green card */}
                            {pricing.total > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">Have a coupon code?</label>
                                    {!bookingData.appliedCoupon ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={bookingData.couponCode}
                                                onChange={(e) => setBookingData({ ...bookingData, couponCode: e.target.value })}
                                                placeholder="Enter coupon code"
                                                className="flex-1 px-4 py-3 rounded-lg text-slate-800 text-base focus:ring-2 focus:ring-green-500 focus:border-green-600 outline-none border border-slate-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleApplyCoupon}
                                                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-base whitespace-nowrap"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between bg-green-50 rounded-lg p-4 border border-green-200">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{bookingData.appliedCoupon}</p>
                                                <p className="text-xs text-green-600">Coupon applied successfully!</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveCoupon}
                                                className="text-xs text-slate-600 hover:text-slate-800 underline font-semibold"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                    {couponError && (
                                        <p className="text-xs text-red-600 mt-2">{couponError}</p>
                                    )}
                                    {couponSuccess && !bookingData.appliedCoupon && (
                                        <p className="text-xs text-green-600 mt-2">{couponSuccess}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
