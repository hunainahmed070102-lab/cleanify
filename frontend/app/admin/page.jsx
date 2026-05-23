'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { CircleDollarSignIcon, CalendarCheck, Clock, CheckCircle, TrendingUp, Star, Wrench, ArrowRight } from 'lucide-react'
import { getAllBookings, computeStats } from '@/lib/bookingService'
import { getReviews } from '@/lib/reviewService'
import Link from 'next/link'
import StatCard from '@/components/admin/ui/StatCard'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import OrdersAreaChart from '@/components/OrdersAreaChart'

export default function AdminDashboard() {
  useEffect(() => {
    document.title = "Cleanify | Admin Dashboard";
  }, []);
  
  const [stats, setStats]               = useState({ total:0, pending:0, confirmed:0, inProgress:0, completed:0, cancelled:0, revenue:0 })
  const [recentBookings, setRecent]     = useState([])
  const [chartData, setChartData]       = useState([])
  const [reviewsCount, setReviewsCount] = useState(0)
  const [servicesCount, setServices]    = useState(0)
  const [loading, setLoading]           = useState(true)

  const load = useCallback(() => {
    // All sync — no network, no await, instant
    const all      = getAllBookings()
    const s        = computeStats(all)
    const reviews  = getReviews()

    // Services count from localStorage cache (no fetch)
    let svcCount = 0
    try {
      const cached = localStorage.getItem('cleanify_services')
      if (cached) svcCount = JSON.parse(cached).length
    } catch (_) {}

    setStats(s)
    setRecent(all.slice(0, 6))
    setChartData(all)
    setReviewsCount(reviews.length)
    setServices(svcCount)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const onStorage = (e) => {
      if (e.key === 'cleanify_bookings' || e.key === 'cleanify_reviews' || e.key === 'cleanify_services') load()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [load])

  // Memoize stat cards to prevent unnecessary re-renders
  const cards = useMemo(() => [
    { title: 'Total Bookings', value: stats.total,          icon: CalendarCheck,        highlight: false },
    { title: 'Pending',        value: stats.pending,        icon: Clock,                highlight: false },
    { title: 'Confirmed',      value: stats.confirmed,      icon: CheckCircle,          highlight: false },
    { title: 'In Progress',    value: stats.inProgress || 0, icon: TrendingUp,          highlight: false },
    { title: 'Completed',      value: stats.completed,      icon: CheckCircle,          highlight: false },
    { title: 'Revenue',        value: `£${stats.revenue}`,  icon: CircleDollarSignIcon, highlight: false },
    { title: 'Services',       value: servicesCount,        icon: Wrench,               highlight: false },
  ], [stats, servicesCount])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-9 h-9 rounded-full border-[3px] border-slate-200 border-t-green-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Dashboard</h1>
        <p className="text-slate-500 text-sm">Welcome back — here's your business at a glance.</p>
      </div>

      {/* Stat Cards - 4 cards in first row, 3 cards in second row (same size) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <StatCard key={i} title={c.title} value={c.value} icon={c.icon} highlight={c.highlight} />
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Booking Overview</h2>
        {chartData.length > 0
          ? <OrdersAreaChart allOrders={chartData} />
          : <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data yet.</div>
        }
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">No bookings yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['ID', 'Customer', 'Service', 'Date', 'Amount', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-slate-600 whitespace-nowrap">{b.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-800">{b.name}</p>
                      <p className="text-xs text-slate-400">{b.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm text-slate-700">{b.subService}</p>
                      <p className="text-xs text-slate-400">{b.serviceCategory}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-sm text-slate-600 whitespace-nowrap">
                      {new Date(b.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-800 whitespace-nowrap">£{b.totalPrice}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
