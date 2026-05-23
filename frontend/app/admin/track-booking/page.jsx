'use client'
import React, { useState, useEffect } from 'react';
import { getBookingById, updateBookingStatus } from '@/lib/bookingService';
import { Search, CheckCircle, Circle } from 'lucide-react';

const STAGES = ['Pending', 'Confirmed', 'In Progress', 'Completed'];

export default function TrackBookingPage() {
    useEffect(() => {
        document.title = "Cleanify | Track Booking";
    }, []);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [booking, setBooking] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        const found = getBookingById(searchQuery.trim());
        setBooking(found || null);
        setSearched(true);
    };

    const getStageIndex = (status) => {
        const idx = STAGES.indexOf(status);
        return idx === -1 ? 0 : idx;
    };

    return (
        <div className="text-slate-500">
            {/* Header */}
            <div className="mb-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-1">Track Booking</h1>
                <p className="text-slate-500">Enter a booking ID to view its current status and timeline.</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter Booking ID"
                            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm text-slate-800"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm shadow-sm"
                    >
                        <Search size={16} />
                        Track
                    </button>
                </form>
            </div>

            {/* Not Found */}
            {searched && !booking && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-slate-400" />
                    </div>
                    <p className="text-slate-700 font-semibold text-lg">Booking not found</p>
                    <p className="text-slate-400 text-sm mt-1">Please check the booking ID and try again.</p>
                </div>
            )}

            {/* Booking Result */}
            {booking && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Top Bar */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <p className="text-green-100 text-xs font-medium mb-0.5">Booking Reference</p>
                                <h2 className="text-2xl font-bold text-white">{booking.id}</h2>
                                <p className="text-green-100 text-sm mt-1">{booking.subService}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="px-4 py-8 border-b border-slate-100 bg-slate-50/40">
                        {booking.status === 'Cancelled' ? (
                            <div className="text-center py-2">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-semibold border border-red-200">
                                    This booking has been cancelled
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center px-4">
                                <div className="relative w-full max-w-4xl">
                                    {/* Stages Container */}
                                    <div className="relative flex items-start justify-between">
                                        {STAGES.map((stage, index) => {
                                            const currentIdx = getStageIndex(booking.status);
                                            const isCompleted = index < currentIdx;
                                            const isActive = index === currentIdx;

                                            return (
                                                <div key={stage} className="flex flex-col items-center relative z-10">
                                                    {/* Circle */}
                                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border-[3px] transition-all ${
                                                        isCompleted
                                                            ? 'bg-green-600 border-green-600 text-white shadow-lg'
                                                            : isActive
                                                            ? 'bg-white border-green-600 text-green-600 shadow-lg'
                                                            : 'bg-white border-slate-300 text-slate-400'
                                                    }`}>
                                                        {isCompleted ? (
                                                            <CheckCircle size={22} strokeWidth={2.5} />
                                                        ) : (
                                                            <Circle size={22} fill={isActive ? '#16a34a' : 'none'} strokeWidth={2.5} />
                                                        )}
                                                    </div>
                                                    
                                                    {/* Label */}
                                                    <span className={`mt-3 text-sm font-bold text-center whitespace-nowrap ${
                                                        isActive ? 'text-green-600' :
                                                        isCompleted ? 'text-slate-700' : 'text-slate-400'
                                                    }`}>
                                                        {stage}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Background Line - positioned behind circles */}
                                    <div className="absolute top-[22px] left-[22px] right-[22px] h-1 bg-slate-300 rounded-full" style={{ transform: 'translateY(-50%)' }}></div>
                                    
                                    {/* Progress Line - positioned behind circles */}
                                    <div className="absolute top-[22px] left-[22px] h-1 bg-green-600 rounded-full transition-all duration-500" 
                                         style={{ 
                                             width: `calc(${(getStageIndex(booking.status) / (STAGES.length - 1)) * 100}% - 44px)`,
                                             transform: 'translateY(-50%)'
                                         }}>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Details */}
                        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm">
                            <h3 className="text-2xl font-bold text-slate-800 mb-5 pb-4 border-b-2 border-slate-100">Customer Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-base font-medium text-slate-600">Name</span>
                                    <span className="text-base font-semibold text-slate-800 text-right">{booking.name}</span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-base font-medium text-slate-600">Phone</span>
                                    <span className="text-base text-slate-800 text-right">{booking.phone}</span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-base font-medium text-slate-600">Email</span>
                                    <span className="text-base text-slate-800 text-right break-all">{booking.email}</span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-base font-medium text-slate-600">Address</span>
                                    <span className="text-base text-slate-800 text-right">{booking.address}</span>
                                </div>
                                <div className="flex justify-between items-start py-2">
                                    <span className="text-base font-medium text-slate-600">Postcode</span>
                                    <span className="text-base font-semibold text-slate-800 text-right">{booking.postcode}</span>
                                </div>
                            </div>
                        </div>

                        {/* Service Details */}
                        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm">
                            <h3 className="text-2xl font-bold text-slate-800 mb-5 pb-4 border-b-2 border-slate-100">Service Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-base font-medium text-slate-600">Service</span>
                                    <span className="text-base font-semibold text-slate-800 text-right">{booking.subService}</span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-base font-medium text-slate-600">Category</span>
                                    <span className="text-base text-slate-800 text-right">{booking.serviceCategory}</span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-base font-medium text-slate-600">Date</span>
                                    <span className="text-base text-slate-800">{new Date(booking.date).toLocaleDateString('en-GB')}</span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-base font-medium text-slate-600">Time</span>
                                    <span className="text-base text-slate-800">{booking.time}</span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-slate-100">
                                    <span className="text-base font-medium text-slate-600">Status</span>
                                    <span className={`text-base font-bold ${
                                        booking.status === 'Completed' ? 'text-green-600' :
                                        booking.status === 'In Progress' ? 'text-blue-600' :
                                        booking.status === 'Confirmed' ? 'text-emerald-600' :
                                        booking.status === 'Pending' ? 'text-amber-600' :
                                        booking.status === 'Cancelled' ? 'text-red-600' :
                                        'text-slate-600'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 bg-green-50 -mx-6 px-6 mt-4 rounded-b-2xl border-t-2 border-green-100">
                                    <span className="text-lg font-bold text-slate-800">Estimated Price</span>
                                    <span className="text-2xl font-bold text-green-600">£{booking.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
