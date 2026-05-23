import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';

// GET all bookings
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    
    return Response.json({ success: true, data: bookings });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST new booking
export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    const booking = await Booking.create(body);
    
    return Response.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
