'use client'
import Link from 'next/link'
import { Home, Sparkles, Building2, Sofa, Truck, Trash2, Boxes, Sparkle } from 'lucide-react'

const allServices = [
    {
        id: 'cleaning',
        name: 'Cleaning Services',
        description: 'Professional cleaning solutions for residential and commercial properties using eco-friendly products and advanced techniques.',
        icon: Home
    },
    {
        id: 'removal',
        name: 'Removal Services',
        description: 'Safe and efficient removal of furniture, appliances, and household items with trained professionals.',
        icon: Sofa
    },
    {
        id: 'disposal',
        name: 'Disposal Services',
        description: 'Environmentally responsible waste disposal following strict recycling and disposal guidelines.',
        icon: Trash2
    },
    {
        id: 'clearance',
        name: 'Clearance Services',
        description: 'Complete property clearance for homes, offices, and commercial spaces with responsible disposal.',
        icon: Boxes
    },
    {
        id: 'moving',
        name: 'Moving Services',
        description: 'Full-service moving assistance including packing, transportation, and unpacking with care.',
        icon: Truck
    },
    {
        id: 'commercial',
        name: 'Commercial Services',
        description: 'Comprehensive property services tailored for businesses including maintenance and support.',
        icon: Building2
    }
];

export default function Services() {
    // Show all 6 services on homepage
    const displayedServices = allServices;
    const totalServices = allServices.length;

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-24 bg-white" id="services">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-green-600 font-semibold uppercase tracking-widest text-sm mb-3">
                        Services
                    </p>
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-800">
                        What We Provide
                    </h2>
                    <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
                        Professional property services across London - from cleaning to clearance, we've got you covered
                    </p>
                </div>

                {/* Services Grid - Show 6 (3 per row) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedServices.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div 
                                key={index} 
                                className="relative group bg-slate-50 rounded-xl p-8 transition-all duration-500 hover:bg-green-600 cursor-pointer animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                {/* Icon Circle */}
                                <div className="w-16 h-16 rounded-full bg-green-600 group-hover:bg-white flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 shadow-lg">
                                    <Icon size={28} className="text-white group-hover:text-green-600 transition-all duration-500" />
                                </div>

                                {/* Service Name */}
                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-white mb-3 transition-all duration-500">
                                    {service.name}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-600 group-hover:text-white/90 transition-all duration-500 leading-relaxed text-sm">
                                    {service.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
