'use client'
import React, { useState, useEffect } from 'react';
import { Wrench, Edit, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllServices, saveService } from '@/lib/serviceApi';
import Modal from '@/components/admin/ui/Modal';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import Loading from '@/components/Loading';

export default function AdminServices() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form, setForm] = useState({ name: '', basePrice: 0, extraRoomCharge: 0, subServices: [] });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        setLoading(true);
        // Show cached data instantly, then refresh from API
        const cached = typeof window !== 'undefined' ? localStorage.getItem('cleanify_services') : null;
        if (cached) {
            try { setCategories(JSON.parse(cached)); setLoading(false); } catch (_) {}
        }
        const data = await getAllServices();
        setCategories(data || []);
        setLoading(false);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setForm(JSON.parse(JSON.stringify(category))); // deep copy
        setIsEditModalOpen(true);
    };

    const handleAddCategory = () => {
        setEditingCategory(null);
        setForm({ 
            id: `cat_${Date.now()}`, 
            name: '', 
            basePrice: 0, 
            extraRoomCharge: 0, 
            subServices: [] 
        });
        setIsEditModalOpen(true);
    };

    const handleAddSubService = () => {
        setForm({
            ...form,
            subServices: [
                ...form.subServices, 
                { name: '', price: 0, isActive: true, image: '' }
            ]
        });
    };

    const handleRemoveSubService = (index) => {
        const newSubs = [...form.subServices];
        newSubs.splice(index, 1);
        setForm({ ...form, subServices: newSubs });
    };

    const handleSubServiceChange = (index, field, value) => {
        const newSubs = [...form.subServices];
        newSubs[index][field] = value;
        setForm({ ...form, subServices: newSubs });
    };

    const handleSave = async () => {
        if (!form.name) {
            toast.error('Category name is required');
            return;
        }

        const savedService = await saveService(form);
        if (savedService) {
            toast.success('Service category saved successfully!');
            setIsEditModalOpen(false);
            loadServices();
        } else {
            toast.error('Failed to save service category');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="text-slate-500">
            <div className="mb-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">Services</h1>
                    <p className="text-slate-500 text-sm">Manage your service categories and sub-services catalog.</p>
                </div>
                <button 
                    onClick={handleAddCategory}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-green-500 hover:shadow-md transition-all group flex flex-col">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm text-white flex items-center justify-center">
                                <Wrench size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white">{category.name}</h3>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                                <span className="text-sm text-slate-500">Base Price:</span>
                                <span className="font-bold text-green-600">£{category.basePrice}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                                <span className="text-sm text-slate-500">Extra Room:</span>
                                <span className="font-bold text-green-600">£{category.extraRoomCharge}</span>
                            </div>

                            <div className="mb-5 flex-1">
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Sub-Services ({category.subServices?.length || 0})</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {category.subServices?.map((sub, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm bg-slate-50 px-3 py-2 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${sub.isActive !== false ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                                <span className="text-slate-700 font-medium">{sub.name}</span>
                                            </div>
                                            <span className="font-semibold text-slate-800">£{sub.price}</span>
                                        </div>
                                    ))}
                                    {(!category.subServices || category.subServices.length === 0) && (
                                        <p className="text-xs text-slate-400 text-center py-4">No sub-services</p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleEditCategory(category)}
                                className="w-full py-2.5 bg-slate-100 text-slate-700 hover:bg-green-600 hover:text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Edit size={16} /> Edit Category
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                title={editingCategory ? "Edit Category" : "Add Category"}
                maxWidth="max-w-3xl"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
                                placeholder="e.g. Cleaning Services"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price (£)</label>
                            <input
                                type="number"
                                value={form.basePrice}
                                onChange={(e) => setForm({ ...form, basePrice: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Extra Room Charge (£)</label>
                            <input
                                type="number"
                                value={form.extraRoomCharge}
                                onChange={(e) => setForm({ ...form, extraRoomCharge: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-slate-800">Sub-Services</h4>
                            <button 
                                onClick={handleAddSubService}
                                className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
                            >
                                <Plus size={16} /> Add Sub-Service
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {form.subServices?.map((sub, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <div className="flex-1 w-full sm:w-auto">
                                        <input
                                            type="text"
                                            value={sub.name}
                                            onChange={(e) => handleSubServiceChange(index, 'name', e.target.value)}
                                            placeholder="Service Name"
                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-green-600"
                                        />
                                    </div>
                                    <div className="w-full sm:w-32">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">£</span>
                                            <input
                                                type="number"
                                                value={sub.price}
                                                onChange={(e) => handleSubServiceChange(index, 'price', parseInt(e.target.value) || 0)}
                                                className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-green-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-48">
                                        <div className="relative">
                                            <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={sub.image || ''}
                                                onChange={(e) => handleSubServiceChange(index, 'image', e.target.value)}
                                                placeholder="Image URL (optional)"
                                                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-green-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={sub.isActive !== false}
                                                onChange={(e) => handleSubServiceChange(index, 'isActive', e.target.checked)}
                                            />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                        <button 
                                            onClick={() => handleRemoveSubService(index)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {form.subServices?.length === 0 && (
                                <div className="text-center p-8 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                                    <p className="text-slate-500 text-sm">No sub-services added yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button 
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-6 py-2.5 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-6 py-2.5 font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors flex items-center gap-2"
                        >
                            <Save size={18} /> Save Category
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
