'use client'
import Link from 'next/link'
import { Bell, Menu } from 'lucide-react'
import { getAllBookings, computeStats } from '@/lib/bookingService'
import { useEffect, useState, useRef, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'

const AdminNavbar = ({ onMenuClick }) => {
  const [pendingCount,    setPending]   = useState(0)
  const [notifications,   setNotifs]    = useState([])
  const [unreadCount,     setUnread]    = useState(0)
  const [showNotifs,      setShowNotifs]= useState(false)
  const dropdownRef = useRef(null)

  const loadNotifs = useCallback(() => {
    try {
      const raw = localStorage.getItem('cleanify_notifications')
      const list = raw ? JSON.parse(raw) : []
      setNotifs(list)
      setUnread(list.filter(n => !n.read).length)
    } catch (_) {}
    const all = getAllBookings()
    setPending(computeStats(all).pending)
  }, [])

  useEffect(() => {
    loadNotifs()
    const onStorage = (e) => {
      if (e.key === 'cleanify_notifications' || e.key === 'cleanify_bookings') loadNotifs()
    }
    const onNewNotif = () => loadNotifs()
    window.addEventListener('storage', onStorage)
    window.addEventListener('newNotification', onNewNotif)
    window.addEventListener('focus', loadNotifs)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('newNotification', onNewNotif)
      window.removeEventListener('focus', loadNotifs)
    }
  }, [loadNotifs])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowNotifs(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    localStorage.setItem('cleanify_notifications', JSON.stringify(updated))
    setNotifs(updated)
    setUnread(0)
  }

  const toggleNotifs = () => {
    if (!showNotifs && unreadCount > 0) markAllRead()
    setShowNotifs(v => !v)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button onClick={onMenuClick} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden">
              <Menu size={22} />
            </button>
            <Link href="/" className="text-2xl font-bold text-slate-700">
              <span className="text-green-600">Clean</span>ify<span className="text-green-600 text-3xl leading-none">.</span>
            </Link>
          </div>

          <div className="flex items-center gap-2" ref={dropdownRef}>
            {/* Bell */}
            <div className="relative">
              <button
                onClick={toggleNotifs}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <span className="text-sm font-bold text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs text-green-600 font-semibold">{unreadCount} new</span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center text-slate-400 text-sm">No notifications yet</div>
                    ) : (
                      notifications.slice(0, 10).map(n => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 border-b border-slate-100 ${!n.read ? 'bg-green-50/60 border-l-2 border-l-green-500' : ''}`}
                        >
                          <p className="text-sm font-semibold text-slate-800">{n.booking?.name}</p>
                          <p className="text-xs text-slate-500">{n.booking?.subService}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-green-600">£{n.booking?.totalPrice}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs text-slate-400">
                              {formatDistanceToNow(new Date(n.timestamp))} ago
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
                      <Link
                        href="/admin/bookings"
                        onClick={() => setShowNotifs(false)}
                        className="text-sm font-semibold text-green-600 hover:text-green-700 block text-center"
                      >
                        View all bookings →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
