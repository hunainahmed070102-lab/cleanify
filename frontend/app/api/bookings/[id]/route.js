import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';

// GET single booking
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const booking = await Booking.findOne({ id: params.id });
    
    if (!booking) {
      return Response.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }
    
    return Response.json({ success: true, data: booking });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// UPDATE booking status
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    const booking = await Booking.findOneAndUpdate(
      { id: params.id },
      body,
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return Response.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }
    
    return Response.json({ success: true, data: booking });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE booking
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const booking = await Booking.findOneAndDelete({ id: params.id });
    
    if (!booking) {
      return Response.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }
    
    return Response.json({ success: true, data: {} });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
