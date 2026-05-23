'use client'
import { useState, useEffect, useCallback } from 'react';
import { getAllBookings, computeStats, deleteBooking } from '@/lib/bookingService';
import { CalendarCheck, Clock, CheckCircle, TrendingUp, Eye, Search, Filter, Trash2 } from 'lucide-react';
import BookingDetailModal from '@/components/admin/BookingDetailModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StatCard from '@/components/admin/ui/StatCard';
import StatusBadge from '@/components/admin/ui/StatusBadge';

const STATUS_FILTERS = ['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function AdminBookings() {
  useEffect(() => {
    document.title = "Cleanify | Manage Bookings";
  }, []);
  
  const [bookings, setBookings]           = useState([]);
  const [stats, setStats]                 = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [search, setSearch]               = useState('');
  const [statusFilter, setStatusFilter]   = useState('All');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // Single read — no async, no network
  const load = useCallback(() => {
    const all = getAllBookings();
    setBookings(all);
    setStats(computeStats(all));
  }, []);

  useEffect(() => {
    load();
    // Refresh when another tab writes to localStorage
    const onStorage = (e) => { if (e.key === 'cleanify_bookings') load(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [load]);

  // Called by modal after a status change — update the row in-place, no full reload
  const handleUpdate = useCallback((bookingId, newStatus) => {
    setBookings(prev => {
      const next = prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
      setStats(computeStats(next));
      return next;
    });
    setSelectedBooking(prev => prev?.id === bookingId ? { ...prev, status: newStatus } : prev);
  }, []);

  const handleDeleteClick = (booking, e) => {
    e.stopPropagation();
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!bookingToDelete) return;
    const success = deleteBooking(bookingToDelete.id);
    if (success) {
      load(); // Reload bookings
      setBookingToDelete(null);
    }
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      b.name?.toLowerCase().includes(q) ||
      b.id?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      b.phone?.includes(q);
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statCards = [
    { title: 'Total',     value: stats.total,     icon: CalendarCheck, highlight: false },
    { title: 'Pending',   value: stats.pending,   icon: Clock,         highlight: false },
    { title: 'Confirmed', value: stats.confirmed, icon: CheckCircle,   highlight: false },
    { title: 'Completed', value: stats.completed, icon: TrendingUp,    highlight: false },
  ];

  return (
    <div className="text-slate-500">
      {/* Header */}
      <div className="mb-6 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Bookings</h1>
        <p className="text-slate-500 text-sm">Manage all customer bookings and update their status.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} icon={s.icon} highlight={s.highlight} />
        ))}
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, booking ID…"
            className="w-full h-10 pl-9 pr-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 transition-all"
          />
        </div>
        <div className="relative sm:w-48">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full h-10 pl-8 pr-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-700 bg-white transition-all appearance-none cursor-pointer"
          >
            {STATUS_FILTERS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarCheck size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-500 font-medium">No bookings found</p>
            <p className="text-slate-400 text-sm mt-1">
              {search || statusFilter !== 'All' ? 'Try adjusting your search or filter.' : 'Bookings will appear here once customers submit the form.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Booking ID', 'Customer', 'Service', 'Date', 'Amount', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(booking => (
                  <tr
                    key={booking.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs font-mono text-slate-700 whitespace-nowrap">{booking.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-800 whitespace-nowrap">{booking.name}</p>
                      <p className="text-xs text-slate-400">{booking.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm text-slate-700 whitespace-nowrap">{booking.serviceCategory}</p>
                      <p className="text-xs text-slate-400">{booking.subService}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell whitespace-nowrap">
                      <p className="text-sm text-slate-700">{new Date(booking.date).toLocaleDateString('en-GB')}</p>
                      <p className="text-xs text-slate-400">{booking.time}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-800 whitespace-nowrap">£{booking.totalPrice}</td>
                    <td className="px-4 py-3"><StatusBadge status={booking.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(booking, e)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Booking"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setBookingToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Booking"
        message={`Are you sure you want to delete booking ${bookingToDelete?.id}? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
