import dbConnect from '@/lib/db';
import Service from '@/models/Service';

const defaultServices = [
  {
    id: 'cleaning',
    name: 'Cleaning Services',
    basePrice: 89,
    extraRoomCharge: 15,
    subServices: [
      { name: 'Home Cleaning', price: 89 },
      { name: 'Office Cleaning', price: 120 },
      { name: 'Deep Cleaning', price: 150 },
      { name: 'End of Tenancy Cleaning', price: 180 },
      { name: 'Carpet Cleaning', price: 75 },
      { name: 'Window Cleaning', price: 60 }
    ]
  },
  {
    id: 'removal',
    name: 'Removal Services',
    basePrice: 149,
    extraRoomCharge: 25,
    subServices: [
      { name: 'Furniture Removal', price: 149 },
      { name: 'Sofa Removal', price: 99 },
      { name: 'Appliance Removal', price: 79 },
      { name: 'House Moving', price: 299 }
    ]
  },
  {
    id: 'disposal',
    name: 'Disposal Services',
    basePrice: 99,
    extraRoomCharge: 10,
    subServices: [
      { name: 'Rubbish Collection', price: 99 },
      { name: 'Junk Removal', price: 129 },
      { name: 'Garden Waste', price: 89 },
      { name: 'Construction Waste', price: 179 }
    ]
  },
  {
    id: 'clearance',
    name: 'Clearance Services',
    basePrice: 129,
    extraRoomCharge: 20,
    subServices: [
      { name: 'House Clearance', price: 199 },
      { name: 'Garage Clearance', price: 149 },
      { name: 'Loft Clearance', price: 129 },
      { name: 'Basement Clearance', price: 159 },
      { name: 'Estate Clearance', price: 299 }
    ]
  }
];

// GET all services
export async function GET(request) {
  try {
    await dbConnect();
    
    let services = await Service.find({}).sort({ createdAt: 1 });
    
    // If no services exist, seed with defaults
    if (services.length === 0) {
      services = await Service.insertMany(defaultServices);
    }
    
    return Response.json({ success: true, data: services });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create/update service
export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    const service = await Service.findOneAndUpdate(
      { id: body.id },
      body,
      { upsert: true, new: true, runValidators: true }
    );
    
    return Response.json({ success: true, data: service });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
