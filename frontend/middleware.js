import { NextResponse } from 'next/server'

export function middleware(request) {
  // Get the pathname
  const pathname = request.nextUrl.pathname

  // Check if it's an admin route
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Check for admin authentication cookie or token
    const adminAuth = request.cookies.get('adminAuth')
    
    // For client-side auth, we'll check if there's any session indicator
    // The actual auth check is done client-side, but we can add basic protection here
    
    // Allow the request to proceed (client-side will handle auth)
    return NextResponse.next()
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: '/admin/:path*'
}
