'use client'
import { useState, useEffect } from 'react'
import { getAllCoupons, saveCoupon, deleteCoupon, generateCouponCode } from '@/lib/couponService'
import { Ticket, Plus, Trash2, Copy, Check, Power } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '@/components/admin/ui/Modal'
import DataTable from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'

export default function CouponsPage() {
    const [coupons, setCoupons] = useState([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [copiedId, setCopiedId] = useState(null)
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        maxUsage: '',
        description: ''
    })

    useEffect(() => {
        loadCoupons()
    }, [])

    const loadCoupons = () => {
        const allCoupons = getAllCoupons()
        setCoupons(allCoupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    }

    const handleCreateCoupon = (e) => {
        e.preventDefault()
        
        if (!formData.code || !formData.discountValue) {
            toast.error('Please fill in required fields')
            return
        }

        const newCoupon = {
            ...formData,
            discountValue: parseFloat(formData.discountValue),
            maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null,
            isActive: true
        }

        saveCoupon(newCoupon)
        toast.success('Coupon created successfully!')
        loadCoupons()
        setShowCreateForm(false)
        setFormData({
            code: '',
            discountType: 'percentage',
            discountValue: '',
            maxUsage: '',
            description: ''
        })
    }

    const handleToggleStatus = (id, currentStatus) => {
        const couponsList = getAllCoupons();
        const index = couponsList.findIndex(c => c.id === id);
        if (index !== -1) {
            couponsList[index].isActive = !currentStatus;
            localStorage.setItem('cleanify_coupons', JSON.stringify(couponsList));
            toast.success(couponsList[index].isActive ? 'Coupon activated' : 'Coupon deactivated');
            loadCoupons();
        }
    }

    const handleDeleteCoupon = (id) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            deleteCoupon(id)
            toast.success('Coupon deleted')
            loadCoupons()
        }
    }

    const handleCopyCode = (code, id) => {
        navigator.clipboard.writeText(code)
        setCopiedId(id)
        toast.success('Code copied to clipboard!')
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleGenerateCode = () => {
        setFormData({
            ...formData,
            code: generateCouponCode('CLEAN')
        })
    }

    const columns = [
        { header: 'Code', accessor: 'code', width: '20%', render: (row) => (
            <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-800">{row.code}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); handleCopyCode(row.code, row.id); }}
                    className="p-1 text-slate-400 hover:text-green-600 transition-colors"
                >
                    {copiedId === row.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
            </div>
        ) },
        { header: 'Discount', accessor: 'discount', width: '12%', render: (row) => (
            <span className="font-semibold text-green-600">
                {row.discountType === 'percentage' ? `${row.discountValue}%` : `£${row.discountValue}`}
            </span>
        ) },
        { header: 'Description', accessor: 'description', width: '30%', hiddenOnMobile: true, render: (row) => (
            <span className="text-sm text-slate-600 truncate max-w-[200px] block">{row.description || '-'}</span>
        ) },
        { header: 'Usage', accessor: 'usage', width: '12%', hiddenOnTablet: true, render: (row) => (
            <span className="text-sm text-slate-600">
                {row.usageCount || 0} / {row.maxUsage ? row.maxUsage : '∞'}
            </span>
        ) },
        { header: 'Status', accessor: 'status', width: '12%', render: (row) => (
            <StatusBadge status={row.isActive ? 'Active' : 'Inactive'} />
        ) },
        { header: 'Actions', accessor: 'actions', width: '14%', align: 'center', render: (row) => (
            <div className="flex gap-2 items-center justify-center">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={row.isActive !== false}
                        onChange={() => handleToggleStatus(row.id, row.isActive)}
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                <button
                    onClick={() => handleDeleteCoupon(row.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Coupon"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        ) }
    ];

    return (
        <div className="text-slate-500 pb-12">
            {/* Header */}
            <div className="mb-8 p-6 bg-white rounded-2xl border-2 border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Coupons</h1>
                    <p className="text-slate-600">Create and manage discount coupons for customers.</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"
                >
                    <Plus size={18} />
                    <span>Create Coupon</span>
                </button>
            </div>

            {/* Coupons List */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden">
                <DataTable 
                    columns={columns}
                    data={coupons}
                    keyField="id"
                    emptyMessage="No coupons found."
                />
            </div>

            <Modal 
                isOpen={showCreateForm} 
                onClose={() => setShowCreateForm(false)} 
                title="Create New Coupon"
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleCreateCoupon} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Coupon Code *
                            </label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all"
                                placeholder="e.g., CLEAN20"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Discount Value *
                            </label>
                            <input
                                type="number"
                                value={formData.discountValue}
                                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all"
                                placeholder="e.g., 20"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Max Usage (Optional)
                            </label>
                            <input
                                type="number"
                                value={formData.maxUsage}
                                onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all"
                                placeholder="e.g., 100"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Expiry Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={formData.expiryDate || ''}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all resize-none"
                            rows="3"
                            placeholder="e.g., Instagram Spring Sale"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowCreateForm(false)}
                            className="px-6 py-2.5 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors"
                        >
                            Create Coupon
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
