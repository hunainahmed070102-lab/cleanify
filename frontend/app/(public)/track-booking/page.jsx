'use client'
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, User, Phone, Mail, MapPin, Package, Calendar, Clock, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { getAllBookings } from '@/lib/bookingService';

function TrackBookingContent() {
    const searchParams = useSearchParams();
    const [trackingId, setTrackingId] = useState('');
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState('');
    const [searching, setSearching] = useState(false);

    // Auto-search if trackingId is in URL
    useEffect(() => {
        const urlTrackingId = searchParams.get('trackingId');
        if (urlTrackingId) {
            setTrackingId(urlTrackingId);
            performSearch(urlTrackingId);
        }
    }, [searchParams]);

    const performSearch = (searchId) => {
        setSearching(true);
        setError('');
        setBooking(null);

        const cleanSearchId = searchId.trim().toUpperCase();

        if (!cleanSearchId) {
            setError('Please enter a tracking ID');
            setSearching(false);
            return;
        }

        const allBookings = getAllBookings();
        const foundBooking = allBookings.find(b => b.id.toUpperCase() === cleanSearchId);

        setTimeout(() => {
            if (foundBooking) {
                setBooking(foundBooking);
                setError('');
            } else {
                setError('No booking found for this tracking ID. Please check your tracking ID and try again.');
                setBooking(null);
            }
            setSearching(false);
        }, 500);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        performSearch(trackingId);
    };

    const getProgressPercentage = (status) => {
        switch (status) {
            case 'Pending': return 25;
            case 'Confirmed': return 50;
            case 'In Progress': return 75;
            case 'Completed': return 100;
            default: return 0;
        }
    };

    const statusSteps = ['Pending', 'Confirmed', 'In Progress', 'Completed'];

    return (
        <section className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-16 md:py-20 pt-24 md:pt-28">
            <div className="max-w-7xl mx-auto">
                {/* Search Form */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8">
                    <form onSubmit={handleSearch}>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                placeholder="Enter your tracking ID"
                                className="flex-1 px-5 py-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-600 outline-none transition-all bg-white text-slate-800 text-base"
                            />
                            <button
                                type="submit"
                                disabled={searching}
                                className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <Search size={20} />
                                {searching ? 'Searching...' : 'Track Booking'}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                </div>

                {/* Booking Details */}
                {booking && (
                    <div className="space-y-6">
                        {/* Status Progress Bar */}
                        {booking.status !== 'Cancelled' ? (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                                <div className="max-w-4xl mx-auto">
                                    {/* Status Steps */}
                                    <div className="relative flex items-center justify-between">
                                        {statusSteps.map((step, index) => {
                                            const isActive = statusSteps.indexOf(booking.status) >= index;
                                            const isCurrent = booking.status === step;
                                            return (
                                                <div key={step} className="flex flex-col items-center relative z-10">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all border-4 ${
                                                        isActive 
                                                            ? 'bg-green-600 border-green-600 text-white' 
                                                            : 'bg-white border-slate-300 text-slate-400'
                                                    }`}>
                                                        {isActive ? (
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        ) : (
                                                            <div className="w-3 h-3 rounded-full bg-slate-300" />
                                                        )}
                                                    </div>
                                                    <div className={`text-xs font-semibold text-center whitespace-nowrap ${
                                                        isCurrent 
                                                            ? 'text-green-600' 
                                                            : isActive 
                                                                ? 'text-slate-700' 
                                                                : 'text-slate-400'
                                                    }`}>
                                                        {step}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        
                                        {/* Progress Line - Behind the dots */}
                                        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 -z-0" style={{ 
                                            left: '24px', 
                                            right: '24px',
                                            width: 'calc(100% - 48px)'
                                        }}>
                                            <div
                                                className="h-full bg-green-600 transition-all duration-500"
                                                style={{ 
                                                    width: booking.status === 'Completed' 
                                                        ? '100%' 
                                                        : `${((statusSteps.indexOf(booking.status)) / (statusSteps.length - 1)) * 100}%` 
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex items-center justify-center gap-3 text-slate-600">
                                    <AlertCircle className="w-6 h-6" />
                                    <span className="font-semibold">This booking has been cancelled</span>
                                </div>
                            </div>
                        )}

                        {/* Two-Card Layout - Premium Design */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Card: Customer Details */}
                            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
                                <h2 className="text-xl font-bold text-slate-800 mb-6 pb-3 border-b border-slate-100">Customer Details</h2>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-slate-500">Name:</span>
                                        <span className="text-sm text-slate-800 font-medium text-right">{booking.name}</span>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-slate-500">Phone:</span>
                                        <span className="text-sm text-slate-800 font-medium text-right">{booking.phone}</span>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-slate-500">Email:</span>
                                        <span className="text-sm text-slate-800 font-medium text-right break-all">{booking.email}</span>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-slate-500">Address:</span>
                                        <span className="text-sm text-slate-800 font-medium text-right max-w-[60%]">{booking.address}</span>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-slate-500">Postcode:</span>
                                        <span className="text-sm text-slate-800 font-medium text-right">{booking.postcode}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Card: Booking Details */}
                            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
                                <h2 className="text-xl font-bold text-slate-800 mb-6 pb-3 border-b border-slate-100">Booking Details</h2>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-slate-500">Tracking ID:</span>
                                        <span className="text-sm text-slate-800 font-mono font-semibold text-right">{booking.id}</span>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-slate-500">Service:</span>
                                        <span className="text-sm text-slate-800 font-medium text-right max-w-[60%]">{booking.serviceCategory}</span>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-slate-500">Sub-Service:</span>
                                        <span className="text-sm text-slate-800 font-medium text-right max-w-[60%]">{booking.subService}</span>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-slate-500">Date:</span>
                                        <span className="text-sm text-slate-800 font-medium text-right">
                                            {new Date(booking.date).toLocaleDateString('en-GB', { 
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-slate-500">Time:</span>
                                        <span className="text-sm text-slate-800 font-medium text-right">{booking.time}</span>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-slate-500">Status:</span>
                                        <span className="text-sm font-semibold text-right" style={{
                                            color: booking.status === 'Pending' ? '#b45309' :
                                                   booking.status === 'Confirmed' ? '#1d4ed8' :
                                                   booking.status === 'In Progress' ? '#7c3aed' :
                                                   booking.status === 'Completed' ? '#16a34a' :
                                                   '#64748b'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-500">Total Price:</span>
                                        <span className="text-2xl font-bold text-green-600">£{booking.totalPrice || 0}</span>
                                    </div>
                                    
                                    {booking.discount > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-green-600">Discount applied:</span>
                                            <span className="text-xs font-semibold text-green-600">-£{booking.discount}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Notes */}
                        {booking.notes && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-3">Additional Notes</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{booking.notes}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {!booking && !error && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Enter Your Tracking ID</h3>
                        <p className="text-slate-600 text-sm">
                            Your tracking ID was provided when you completed your booking.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default function TrackBookingPage() {
    useEffect(() => {
        document.title = "Cleanify | Track Booking";
    }, []);

    return (
        <Suspense fallback={
            <section className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Search className="w-10 h-10 text-slate-400" />
                        </div>
                        <p className="text-slate-600 text-sm">Loading...</p>
                    </div>
                </div>
            </section>
        }>
            <TrackBookingContent />
        </Suspense>
    );
}
