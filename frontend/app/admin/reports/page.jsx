'use client'
import { useState, useEffect } from 'react'
import StatCard from '@/components/admin/ui/StatCard'
import OrdersAreaChart from '@/components/OrdersAreaChart'
import { getAllBookings, computeStats } from '@/lib/bookingService'
import { CircleDollarSignIcon, CalendarCheck, CheckCircle, XCircle } from 'lucide-react'

export default function ReportsPage() {
  const [stats, setStats]         = useState(null)
  const [allBookings, setBookings] = useState([])

  useEffect(() => {
    const all = getAllBookings()
    setStats(computeStats(all))
    setBookings(all)
  }, [])

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-9 h-9 rounded-full border-[3px] border-slate-200 border-t-green-600 animate-spin" />
      </div>
    )
  }

  const cards = [
    { title: 'Total Revenue',  value: `£${stats.revenue}`, icon: CircleDollarSignIcon, highlight: true  },
    { title: 'Total Bookings', value: stats.total,          icon: CalendarCheck,        highlight: false },
    { title: 'Completed Jobs', value: stats.completed,      icon: CheckCircle,          highlight: false },
    { title: 'Cancelled Jobs', value: stats.cancelled,      icon: XCircle,              highlight: false },
  ]

  const chartData = allBookings.map(b => ({ createdAt: b.createdAt, total: b.totalPrice || 0 }))

  return (
    <div className="space-y-6 pb-12">
      <div className="p-5 bg-white rounded-2xl border-2 border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Reports</h1>
          <p className="text-slate-500 text-sm">Business performance and revenue analytics.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <StatCard key={i} title={c.title} value={c.value} icon={c.icon} highlight={c.highlight} />
        ))}
      </div>

      <div className="bg-white rounded-2xl border-2 border-slate-100 p-6">
        <h2 className="text-base font-bold text-slate-800 mb-6">Revenue Over Time</h2>
        {chartData.length > 0
          ? <div className="h-96"><OrdersAreaChart allOrders={chartData} /></div>
          : <div className="h-96 flex items-center justify-center text-slate-400 text-sm">No data yet.</div>
        }
      </div>

      {/* Breakdown table */}
      <div className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden mt-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Status Breakdown</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { label: 'Pending',     value: stats.pending,    color: 'bg-yellow-500' },
            { label: 'Confirmed',   value: stats.confirmed,  color: 'bg-blue-500'   },
            { label: 'In Progress', value: stats.inProgress, color: 'bg-purple-500' },
            { label: 'Completed',   value: stats.completed,  color: 'bg-green-500'  },
            { label: 'Cancelled',   value: stats.cancelled,  color: 'bg-red-500'    },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                <span className="text-sm text-slate-700">{row.label}</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
