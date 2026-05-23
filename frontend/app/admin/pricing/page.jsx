'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllPricingData, updateSubServicePrice, updateCategoryBasePrice, initializePricingData } from '@/lib/pricingData';

export default function PricingPage() {
    useEffect(() => {
        document.title = "Cleanify | Pricing Management";
    }, []);

    const [services, setServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [editingService, setEditingService] = useState(null);
    const [editPrice, setEditPrice] = useState('');
    const [editingBasePrice, setEditingBasePrice] = useState(null);
    const [editBasePriceValue, setEditBasePriceValue] = useState('');

    // Load data once on mount
    useEffect(() => {
        initializePricingData();
        loadServices();

        // Listen for storage changes from other tabs/components
        const handleStorage = (e) => {
            if (e.key === 'cleanify_services') {
                loadServices();
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const loadServices = useCallback(() => {
        const data = getAllPricingData();
        setServices(data);
    }, []);

    // Memoize category names
    const categoryNames = useMemo(() => {
        return ['All', ...services.map(s => s.name)];
    }, [services]);

    // Memoize filtered services
    const filteredServices = useMemo(() => {
        return services.filter(category => {
            const matchesCategory = selectedCategory === 'All' || category.name === selectedCategory;
            if (!matchesCategory) return false;

            if (!searchQuery) return true;

            const query = searchQuery.toLowerCase();
            const categoryMatch = category.name.toLowerCase().includes(query);
            const subServiceMatch = category.subServices.some(sub => 
                sub.name.toLowerCase().includes(query)
            );

            return categoryMatch || subServiceMatch;
        });
    }, [services, searchQuery, selectedCategory]);

    const handleStartEdit = useCallback((categoryId, subServiceName, currentPrice) => {
        setEditingService(`${categoryId}-${subServiceName}`);
        setEditPrice(currentPrice.toString());
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingService(null);
        setEditPrice('');
    }, []);

    const handleSavePrice = useCallback((categoryId, subServiceName) => {
        const price = parseFloat(editPrice);
        if (isNaN(price) || price < 0) {
            toast.error('Please enter a valid price');
            return;
        }

        const success = updateSubServicePrice(categoryId, subServiceName, price, undefined);
        if (success) {
            toast.success('Price updated successfully');
            loadServices();
            setEditingService(null);
            setEditPrice('');
        } else {
            toast.error('Failed to update price');
        }
    }, [editPrice, loadServices]);

    const handleToggleStatus = useCallback((categoryId, subServiceName, currentStatus) => {
        const success = updateSubServicePrice(categoryId, subServiceName, undefined, !currentStatus);
        if (success) {
            toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'}`);
            loadServices();
        } else {
            toast.error('Failed to update status');
        }
    }, [loadServices]);

    const handleStartEditBasePrice = useCallback((categoryId, currentBasePrice) => {
        setEditingBasePrice(categoryId);
        setEditBasePriceValue(currentBasePrice.toString());
    }, []);

    const handleCancelEditBasePrice = useCallback(() => {
        setEditingBasePrice(null);
        setEditBasePriceValue('');
    }, []);

    const handleSaveBasePrice = useCallback((categoryId) => {
        const price = parseFloat(editBasePriceValue);
        if (isNaN(price) || price < 0) {
            toast.error('Please enter a valid base price');
            return;
        }

        const success = updateCategoryBasePrice(categoryId, price);
        if (success) {
            toast.success('Base price updated successfully');
            loadServices();
            setEditingBasePrice(null);
            setEditBasePriceValue('');
        } else {
            toast.error('Failed to update base price');
        }
    }, [editBasePriceValue, loadServices]);

    return (
        <div className="text-slate-500">
            {/* Header */}
            <div className="mb-6 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-800 mb-1">Pricing Management</h1>
                <p className="text-slate-500 text-sm">Manage competitive London rates for all services. Changes reflect instantly on the main website.</p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search services..."
                        className="w-full h-10 pl-9 pr-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 transition-all"
                    />
                </div>
                <div className="relative sm:w-48">
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full h-10 pl-8 pr-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-700 bg-white transition-all appearance-none cursor-pointer"
                    >
                        {categoryNames.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Services List */}
            {filteredServices.length > 0 ? (
                <div className="space-y-4">
                    {filteredServices.map(category => (
                        <div key={category.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Category Header */}
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">{category.name}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-500">Base Price:</span>
                                            {editingBasePrice === category.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={editBasePriceValue}
                                                        onChange={(e) => setEditBasePriceValue(e.target.value)}
                                                        className="w-20 px-2 py-1 border border-green-500 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSaveBasePrice(category.id);
                                                            if (e.key === 'Escape') handleCancelEditBasePrice();
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleSaveBasePrice(category.id)}
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEditBasePrice}
                                                        className="p-1 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleStartEditBasePrice(category.id, category.basePrice)}
                                                    className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors"
                                                >
                                                    £{category.basePrice}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500">{category.subServices.length} services</span>
                                </div>
                            </div>

                            {/* Sub-services Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500">Service</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500">Price</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {category.subServices.map(subService => {
                                            const editKey = `${category.id}-${subService.name}`;
                                            const isEditing = editingService === editKey;

                                            return (
                                                <tr key={subService.name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3 text-sm text-slate-800 font-medium">{subService.name}</td>
                                                    <td className="px-4 py-3">
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                value={editPrice}
                                                                onChange={(e) => setEditPrice(e.target.value)}
                                                                className="w-20 px-2 py-1 border border-green-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                                                autoFocus
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleSavePrice(category.id, subService.name);
                                                                    if (e.key === 'Escape') handleCancelEdit();
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="text-sm font-bold text-green-600">£{subService.price}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => handleToggleStatus(category.id, subService.name, subService.isActive)}
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                                                                subService.isActive
                                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            {subService.isActive ? 'Active' : 'Inactive'}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {isEditing ? (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleSavePrice(category.id, subService.name)}
                                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                    title="Save"
                                                                >
                                                                    <Check size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelEdit}
                                                                    className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                                                                    title="Cancel"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleStartEdit(category.id, subService.name, subService.price)}
                                                                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-green-600 hover:text-white transition-colors"
                                                            >
                                                                Edit
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                    <p className="text-slate-500">No services found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
