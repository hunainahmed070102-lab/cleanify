'use client'
import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DATE_FILTERS = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7days' },
  { label: 'One Month', value: '30days' },
  { label: 'All Time', value: 'all' }
]

export default function OrdersAreaChart({ allOrders }) {
  const [dateFilter, setDateFilter] = useState('all')

  // Filter bookings by date range
  const getFilteredBookings = () => {
    if (!allOrders || allOrders.length === 0) return []
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (dateFilter) {
      case 'today':
        return allOrders.filter(b => {
          const bookingDate = new Date(b.createdAt)
          return bookingDate >= today
        })
      case '7days':
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(today.getDate() - 7)
        return allOrders.filter(b => new Date(b.createdAt) >= sevenDaysAgo)
      case '30days':
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(today.getDate() - 30)
        return allOrders.filter(b => new Date(b.createdAt) >= thirtyDaysAgo)
      default:
        return allOrders
    }
  }

  const filteredBookings = getFilteredBookings()

  // Group bookings by date and status
  const bookingsByDate = filteredBookings.reduce((acc, booking) => {
    const date = new Date(booking.createdAt).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { date, Pending: 0, Confirmed: 0, 'In Progress': 0, Completed: 0, Cancelled: 0, total: 0 }
    }
    acc[date][booking.status] = (acc[date][booking.status] || 0) + 1
    acc[date].total += 1
    return acc
  }, {})

  // Convert to array and sort by date
  const chartData = Object.values(bookingsByDate).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  )

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-slate-800 mb-2">{formatDate(data.date)}</p>
          <div className="space-y-1">
            <p className="text-xs text-slate-600">Total: <span className="font-bold">{data.total}</span></p>
            {data.Pending > 0 && <p className="text-xs text-yellow-600">Pending: {data.Pending}</p>}
            {data.Confirmed > 0 && <p className="text-xs text-blue-600">Confirmed: {data.Confirmed}</p>}
            {data['In Progress'] > 0 && <p className="text-xs text-purple-600">In Progress: {data['In Progress']}</p>}
            {data.Completed > 0 && <p className="text-xs text-green-600">Completed: {data.Completed}</p>}
            {data.Cancelled > 0 && <p className="text-xs text-red-600">Cancelled: {data.Cancelled}</p>}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      {/* Date Filter Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {DATE_FILTERS.map(filter => (
          <button
            key={filter.value}
            onClick={() => setDateFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              dateFilter === filter.value
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-slate-400 text-sm">
          No bookings found for this period.
        </div>
      ) : (
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={formatDate}
              />
              <YAxis 
                allowDecimals={false} 
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                label={{ 
                  value: 'Bookings', 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: '#64748b',
                  fontSize: 12
                }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#16a34a" 
                fill="url(#colorTotal)" 
                strokeWidth={2.5}
                name="Total Bookings"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
