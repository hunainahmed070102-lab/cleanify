'use client'
import React, { useState, useEffect } from 'react';
import { getAllBookings } from '@/lib/bookingService';
import { Users, Search, Phone, Mail, MapPin, Calendar, PoundSterling, TrendingUp, Package } from 'lucide-react';

export default function BookingCustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadCustomers = () => {
            const bookings = getAllBookings();

            // Group bookings by customer email
            const customerMap = {};
            bookings.forEach(booking => {
                if (!customerMap[booking.email]) {
                    customerMap[booking.email] = {
                        email: booking.email,
                        name: booking.name,
                        phone: booking.phone,
                        address: booking.address,
                        postcode: booking.postcode,
                        totalBookings: 0,
                        totalSpent: 0,
                        lastBookingDate: booking.createdAt,
                        firstBookingDate: booking.createdAt,
                        bookings: []
                    };
                }

                const customer = customerMap[booking.email];
                customer.totalBookings += 1;
                customer.totalSpent += (booking.totalPrice || 0);
                customer.bookings.push(booking);

                if (new Date(booking.createdAt) > new Date(customer.lastBookingDate)) {
                    customer.lastBookingDate = booking.createdAt;
                }
                if (new Date(booking.createdAt) < new Date(customer.firstBookingDate)) {
                    customer.firstBookingDate = booking.createdAt;
                }
            });

            // Sort by total spent (highest first)
            const sortedCustomers = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
            setCustomers(sortedCustomers);
            setLoading(false);
        };

        loadCustomers();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery) ||
        customer.postcode?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate stats
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalCustomers > 0 ? totalRevenue / customers.reduce((sum, c) => sum + c.totalBookings, 0) : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading customers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-12">
            {/* Header */}
            <div className="mb-6 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-800 mb-1">Customers</h1>
                <p className="text-slate-500 text-sm">
                    Manage and view all customer records from bookings
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="group bg-white rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-green-500 hover:shadow-md">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 bg-slate-100 text-slate-500 group-hover:bg-green-100 group-hover:text-green-600">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-0.5 font-medium">Total Customers</p>
                    <p className="text-2xl font-bold text-slate-800">{totalCustomers}</p>
                    <p className="text-xs text-slate-400 mt-1">Active customer base</p>
                </div>
                
                <div className="group bg-white rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-green-500 hover:shadow-md">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 bg-slate-100 text-slate-500 group-hover:bg-green-100 group-hover:text-green-600">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-0.5 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-slate-800">£{totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-slate-400 mt-1">From all bookings</p>
                </div>
                
                <div className="group bg-white rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-green-500 hover:shadow-md">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 bg-slate-100 text-slate-500 group-hover:bg-green-100 group-hover:text-green-600">
                            <Package size={20} />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-0.5 font-medium">Avg Order Value</p>
                    <p className="text-2xl font-bold text-slate-800">£{avgOrderValue.toFixed(2)}</p>
                    <p className="text-xs text-slate-400 mt-1">Per booking average</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, phone, or postcode..."
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none text-sm text-slate-800"
                    />
                </div>
            </div>

            {/* Customers Table */}
            {filteredCustomers.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-16 text-center">
                    <Users size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500 font-medium">No customers found</p>
                    <p className="text-slate-400 text-sm mt-1">
                        {searchQuery ? 'Try a different search term' : 'Customers appear here when they submit bookings'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap">Customer</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap hidden md:table-cell">Contact</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap hidden lg:table-cell">Location</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap">Bookings</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap">Total Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer, index) => (
                                    <tr key={customer.email} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        {/* Customer Info */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                                                    {customer.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-800 truncate">{customer.name}</p>
                                                    <p className="text-xs text-slate-400 truncate md:hidden">{customer.email}</p>
                                                    <p className="text-xs text-slate-400 truncate md:hidden">{customer.phone}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact (Hidden on mobile) */}
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <p className="text-sm text-slate-800 truncate">{customer.email}</p>
                                            <p className="text-sm text-slate-600">{customer.phone}</p>
                                        </td>

                                        {/* Location (Hidden on tablet and below) */}
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <p className="text-sm text-slate-800 truncate">{customer.address}</p>
                                            {customer.postcode && (
                                                <p className="text-sm text-slate-600 font-mono mt-0.5">{customer.postcode}</p>
                                            )}
                                        </td>

                                        {/* Bookings */}
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-lg font-bold text-green-600">{customer.totalBookings}</span>
                                            <span className="text-xs text-slate-500 ml-1">booking{customer.totalBookings !== 1 ? 's' : ''}</span>
                                        </td>

                                        {/* Total Spent */}
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-bold text-slate-800">£{customer.totalSpent.toFixed(2)}</span>
                                                <span className="text-xs text-slate-400">
                                                    Last: {new Date(customer.lastBookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
