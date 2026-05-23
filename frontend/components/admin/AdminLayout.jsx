'use client'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { isAuthenticated } from '@/lib/authService'
import { useRouter, usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

const AdminLayout = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsChecking(false)
      setIsAuthed(false)
      return
    }

    // Check authentication immediately without delay
    const authenticated = isAuthenticated()
    
    if (!authenticated) {
      // Not authenticated - redirect to login
      setIsAuthed(false)
      setIsChecking(false)
      router.replace('/admin/login')
    } else {
      // Authenticated - allow access immediately
      setIsAuthed(true)
      setIsChecking(false)
    }
  }, [pathname, router])

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Login page - render without layout
  if (pathname === '/admin/login') {
    return children
  }

  // Not authenticated - don't render anything (redirect will happen)
  if (!isAuthed) {
    return null
  }

  // Authenticated - render admin layout
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#16a34a',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fff',
            },
          },
        }}
      />
      <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200
          transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:flex lg:flex-col
        `}>
          {/* Mobile close button */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 lg:hidden">
            <span className="font-semibold text-slate-700 text-sm">Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
