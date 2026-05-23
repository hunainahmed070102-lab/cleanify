'use client'

import { usePathname } from 'next/navigation'
import { LayoutDashboard, CalendarCheck, Settings, LogOut, Ticket, Star, Users, MapPin, BarChart3, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { getAllBookings, computeStats } from '@/lib/bookingService'
import { logout } from '@/lib/authService'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const AdminSidebar = ({ onClose }) => {
  const pathname = usePathname()
  const router   = useRouter()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const refresh = () => {
      const all = getAllBookings()
      setPendingCount(computeStats(all).pending)
    }
    refresh()
    // Refresh only on storage change — no polling interval
    const onStorage = (e) => { if (e.key === 'cleanify_bookings') refresh() }
    window.addEventListener('storage', onStorage)
    // Also refresh when tab gets focus
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  const handleLogout = () => {
    toast.success('Logged out')
    logout()
    router.push('/admin/login')
  }

  const links = [
    { name: 'Dashboard',         href: '/admin',                icon: LayoutDashboard },
    { name: 'Bookings',          href: '/admin/bookings',       icon: CalendarCheck, badge: pendingCount },
    { name: 'Track Booking',     href: '/admin/track-booking',  icon: MapPin },
    { name: 'Pricing',           href: '/admin/pricing',        icon: DollarSign },
    { name: 'Booking Customers', href: '/admin/customers',      icon: Users },
    { name: 'Coupons',           href: '/admin/coupons',        icon: Ticket },
    { name: 'Reviews',           href: '/admin/reviews',        icon: Star },
    { name: 'Reports',           href: '/admin/reports',        icon: BarChart3 },
    { name: 'Settings',          href: '/admin/settings',       icon: Settings },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-0.5 mt-2 p-3">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 text-sm font-medium rounded-xl px-3 py-2.5 transition-colors ${
                active
                  ? 'bg-green-50 text-green-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <link.icon size={18} className={active ? 'text-green-600' : 'text-slate-400'} />
              <span>{link.name}</span>
              {link.badge > 0 && (
                <span className="ml-auto bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {link.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <div className="mt-auto p-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 px-3 py-2.5 rounded-xl w-full text-left transition-colors group"
        >
          <LogOut size={18} className="text-slate-400 group-hover:text-red-600 transition-colors" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
