'use client'
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Sofa, Trash2, Boxes, Truck, Building2, ChevronLeft, ChevronRight, Check, ArrowRight } from 'lucide-react';
import { getAllPricingData, initializePricingData } from '@/lib/pricingData';

export default function Pricing() {
    const router = useRouter();
    const [services, setServices] = useState([]);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        // Initialize pricing data if not exists
        initializePricingData();
        
        // Load pricing data
        const loadPricing = () => {
            const data = getAllPricingData();
            setServices(data);
        };
        
        loadPricing();

        // Listen for pricing updates from admin panel
        const handleStorage = (e) => {
            if (e.key === 'cleanify_services') {
                loadPricing();
            }
        };
        
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 420;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Memoize pricing plans to avoid recalculation
    const pricingPlans = useMemo(() => [
        {
            title: 'Cleaning Services',
            categoryId: 'cleaning-services',
            description: 'Professional home, office, and deep cleaning with eco-friendly products',
            icon: Home,
            features: [
                { text: 'Home & Office Cleaning', icon: Home },
                { text: 'Deep Cleaning', icon: Home },
                { text: 'Carpet & Window Cleaning', icon: Home },
                { text: 'Eco-friendly Products', icon: Check },
            ],
            serviceCategory: 'Cleaning Services',
        },
        {
            title: 'Removal Services',
            categoryId: 'removal-services',
            description: 'Safe furniture, appliance removal and house moving assistance',
            icon: Sofa,
            features: [
                { text: 'Furniture Removal', icon: Sofa },
                { text: 'Appliance Removal', icon: Sofa },
                { text: 'House Moving', icon: Truck },
                { text: 'Fully Insured', icon: Check },
            ],
            serviceCategory: 'Removal Services',
        },
        {
            title: 'Disposal Services',
            categoryId: 'disposal-services',
            description: 'Responsible junk removal and waste disposal services',
            icon: Trash2,
            features: [
                { text: 'Junk Removal', icon: Trash2 },
                { text: 'Rubbish Collection', icon: Trash2 },
                { text: 'Garden Waste', icon: Trash2 },
                { text: 'Eco-friendly Disposal', icon: Check },
            ],
            serviceCategory: 'Disposal Services',
        },
        {
            title: 'Clearance Services',
            categoryId: 'clearance-services',
            description: 'Complete house, garage, and estate clearance solutions',
            icon: Boxes,
            features: [
                { text: 'Full House Clearance', icon: Boxes },
                { text: 'Garage & Loft Clearance', icon: Boxes },
                { text: 'Estate Clearance', icon: Boxes },
                { text: 'Complete Decluttering', icon: Check },
            ],
            serviceCategory: 'Clearance Services',
        },
        {
            title: 'Moving Services',
            categoryId: 'moving-services',
            description: 'Professional moving with packing and storage solutions',
            icon: Truck,
            features: [
                { text: 'Residential Moving', icon: Truck },
                { text: 'Commercial Moving', icon: Building2 },
                { text: 'Packing Services', icon: Boxes },
                { text: 'Storage Solutions', icon: Check },
            ],
            serviceCategory: 'Moving Services',
        },
        {
            title: 'Commercial Services',
            categoryId: 'commercial-services',
            description: 'Office cleaning and property maintenance for businesses',
            icon: Building2,
            features: [
                { text: 'Office Cleaning', icon: Building2 },
                { text: 'Property Maintenance', icon: Building2 },
                { text: 'Facility Management', icon: Building2 },
                { text: 'Contract Options', icon: Check },
            ],
            serviceCategory: 'Commercial Services',
        },
    ], []);

    // Get price for a category
    const getPrice = (categoryId) => {
        const category = services.find(s => s.id === categoryId);
        return category?.basePrice || 0;
    };

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-24 bg-gradient-to-b from-white via-slate-50 to-white" id="pricing">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-green-600 font-semibold uppercase tracking-widest text-sm mb-3">
                        Pricing
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        Simple & Transparent Pricing
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Professional property services with clear pricing. Final quote based on your specific requirements.
                    </p>
                </div>

                {/* Desktop: Scrollable carousel */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-12 h-12 bg-white rounded-full shadow-xl border-2 border-slate-100 flex items-center justify-center text-slate-600 hover:text-white hover:bg-green-600 hover:border-green-600 transition-all hidden lg:flex group"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-12 h-12 bg-white rounded-full shadow-xl border-2 border-slate-100 flex items-center justify-center text-slate-600 hover:text-white hover:bg-green-600 hover:border-green-600 transition-all hidden lg:flex group"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} className="group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Scrollable Container */}
                    <div 
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {pricingPlans.map((plan, index) => {
                            const IconComponent = plan.icon;
                            const price = getPrice(plan.categoryId);
                            
                            return (
                                <div
                                    key={index}
                                    className="group relative bg-white border-2 border-slate-200 rounded-2xl p-8 transition-all duration-300 flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
                                >
                                    {/* Title & Description */}
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-green-600 transition-colors">
                                        {plan.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6 min-h-[40px]">
                                        {plan.description}
                                    </p>

                                    {/* Price */}
                                    <div className="mb-8 pb-6 border-b border-slate-100">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-bold text-slate-800 group-hover:text-green-600 transition-colors">
                                                £{price}
                                            </span>
                                            <span className="text-slate-500 text-lg font-medium">starting</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">Final price based on requirements</p>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, i) => {
                                            const FeatureIcon = feature.icon;
                                            return (
                                                <li key={i} className="flex items-start gap-3 text-slate-700">
                                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-600 transition-colors">
                                                        {FeatureIcon === Check ? (
                                                            <Check size={12} className="text-green-600 group-hover:text-white transition-colors" />
                                                        ) : (
                                                            <FeatureIcon size={12} className="text-green-600 group-hover:text-white transition-colors" />
                                                        )}
                                                    </div>
                                                    <span className="text-sm leading-tight">{feature.text}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => {
                                            router.push(`/booking?service=${encodeURIComponent(plan.serviceCategory)}`);
                                        }}
                                        className="w-full py-4 bg-slate-100 text-slate-800 rounded-xl font-semibold transition-all duration-300 hover:bg-green-600 hover:text-white group-hover:bg-green-600 group-hover:text-white flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                                    >
                                        Book Now
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
            </div>
        </section>
    );
}
