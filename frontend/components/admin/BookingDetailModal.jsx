'use client'
import { useState } from 'react';
import { X, Download } from 'lucide-react';
import { generateInvoiceExcel } from '@/lib/generateExcel';
import { updateBookingStatus } from '@/lib/bookingService';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function BookingDetailModal({ booking, onClose, onUpdate }) {
  const [currentStatus, setCurrentStatus] = useState(booking.status);
  const [saving, setSaving] = useState(false);

  const handleStatusChange = (newStatus) => {
    if (newStatus === currentStatus) return;
    setSaving(true);
    const ok = updateBookingStatus(booking.id, newStatus);
    if (ok) {
      setCurrentStatus(newStatus);
      onUpdate(booking.id, newStatus);
    }
    setSaving(false);
  };

  const handleDownloadExcel = () => {
    try {
      generateInvoiceExcel(booking);
    } catch (error) {
      console.error('Failed to download Excel:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600';
      case 'In Progress': return 'text-blue-600';
      case 'Confirmed': return 'text-emerald-600';
      case 'Pending': return 'text-amber-600';
      case 'Cancelled': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col">

        {/* Top Header */}
        <div className="border-b border-slate-200 px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Booking Details</h2>
              <p className="text-sm text-slate-500 mt-1">
                <span className="font-medium">Tracking ID:</span> <span className="font-mono text-slate-700">{booking.id}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={currentStatus}
                onChange={e => handleStatusChange(e.target.value)}
                disabled={saving}
                className="text-sm border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-medium cursor-pointer min-w-[160px]"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-2 transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Booking Details Section - Hidden Scrollbar */}
        <div className="px-6 py-6 flex-1 overflow-y-auto scrollbar-hide">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-5 pb-3 border-b border-slate-200">Complete Booking Information</h3>
            
            <div className="space-y-3">
              {/* Customer Name */}
              <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-600 min-w-[140px]">Customer Name:</span>
                <span className="text-sm text-slate-800 text-right font-medium">{booking.name}</span>
              </div>

              {/* Phone */}
              <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-600 min-w-[140px]">Phone:</span>
                <span className="text-sm text-slate-800 text-right">{booking.phone}</span>
              </div>

              {/* Email */}
              <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-600 min-w-[140px]">Email:</span>
                <span className="text-sm text-slate-800 text-right break-all">{booking.email}</span>
              </div>

              {/* Address */}
              <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-600 min-w-[140px]">Address:</span>
                <span className="text-sm text-slate-800 text-right max-w-[60%]">{booking.address}</span>
              </div>

              {/* Postcode */}
              <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-600 min-w-[140px]">Postcode:</span>
                <span className="text-sm text-slate-800 text-right font-medium">{booking.postcode}</span>
              </div>

              {/* Service Category */}
              <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-600 min-w-[140px]">Service Category:</span>
                <span className="text-sm text-slate-800 text-right font-medium">{booking.serviceCategory}</span>
              </div>

              {/* Sub-Service */}
              <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-600 min-w-[140px]">Sub-Service:</span>
                <span className="text-sm text-slate-800 text-right">{booking.subService}</span>
              </div>

              {/* Booking Date */}
              <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-600 min-w-[140px]">Booking Date:</span>
                <span className="text-sm text-slate-800 text-right">{new Date(booking.date).toLocaleDateString('en-GB')}</span>
              </div>

              {/* Booking Time */}
              <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-600 min-w-[140px]">Booking Time:</span>
                <span className="text-sm text-slate-800 text-right">{booking.time}</span>
              </div>

              {/* Current Status */}
              <div className="flex justify-between items-start py-2.5">
                <span className="text-sm font-semibold text-slate-600 min-w-[140px]">Current Status:</span>
                <span className={`text-sm font-bold text-right ${getStatusColor(currentStatus)}`}>
                  {currentStatus}
                </span>
              </div>

              {/* Estimated Total */}
              <div className="flex justify-between items-center py-5 mt-4 pt-5 border-t border-slate-200">
                <span className="text-lg font-bold text-slate-700">Estimated Total:</span>
                <span className="text-3xl font-bold text-green-600">£{booking.totalPrice}</span>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="pt-4 mt-2">
                  <span className="text-sm font-semibold text-slate-600 block mb-2">Notes:</span>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                    {booking.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Excel Download Button */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 rounded-b-2xl flex-shrink-0">
          <button
            onClick={handleDownloadExcel}
            className="w-full bg-green-600 text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-green-700 text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Download size={20} />
            Download Excel
          </button>
        </div>

      </div>
    </div>
  );
}
