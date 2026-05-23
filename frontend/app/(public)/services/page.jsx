'use client'
import { useEffect } from 'react';
import Link from 'next/link'
import { Home, Sofa, Trash2, Boxes, Truck, Building2 } from 'lucide-react'

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

export default function AllServices() {
    useEffect(() => {
        document.title = "Cleanify | Services";
    }, []);
    
    return (
        <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-24 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                    <p className="text-green-600 font-semibold uppercase tracking-widest text-sm mb-3">
                        All Services
                    </p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
                        Our Complete Service Range
                    </h1>
                    <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
                        Explore all {allServices.length} professional property services we offer across London
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allServices.map((service, index) => {
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

                {/* CTA Section */}
                <div className="mt-16 bg-green-600 rounded-lg p-12 text-center text-white">
                    <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
                    <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                        Book any of our professional services today and experience the Cleanify difference
                    </p>
                    <Link 
                        href="/booking" 
                        className="inline-block px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all text-base"
                    >
                        Book a Service Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
