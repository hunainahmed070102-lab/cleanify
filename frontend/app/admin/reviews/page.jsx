'use client'
import { useState, useEffect } from 'react';
import { Star, Plus, Edit2, Trash2, Save, X, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getReviews, addReview, updateReview, deleteReview } from '@/lib/reviewService';

const emptyForm = { image: '', name: '', review: '', rating: 5, visible: true };

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        loadReviews();
        const handleUpdate = () => loadReviews();
        window.addEventListener('reviewsUpdated', handleUpdate);
        return () => window.removeEventListener('reviewsUpdated', handleUpdate);
    }, []);

    const loadReviews = () => setReviews(getReviews());

    const handleSave = () => {
        if (!formData.name.trim() || !formData.review.trim()) {
            toast.error('Name and review text are required');
            return;
        }
        if (editingId) {
            updateReview(editingId, formData);
            toast.success('Review updated');
        } else {
            addReview(formData);
            toast.success('Review added');
        }
        resetForm();
    };

    const handleEdit = (review) => {
        setEditingId(review.id);
        setFormData({
            image: review.image || '',
            name: review.name,
            review: review.review,
            rating: review.rating || 5,
            visible: review.visible !== false
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this review?')) return;
        deleteReview(id);
        toast.success('Review deleted');
    };

    const handleToggleVisible = (review) => {
        updateReview(review.id, { visible: review.visible === false ? true : false });
        toast.success(review.visible === false ? 'Review shown on website' : 'Review hidden from website');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setFormData(f => ({ ...f, image: reader.result }));
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData(emptyForm);
    };

    const StarRating = ({ value, onChange, size = 22 }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    className="transition-transform hover:scale-110"
                >
                    <Star
                        size={size}
                        className={star <= value ? 'text-yellow-400' : 'text-slate-200'}
                        fill={star <= value ? 'currentColor' : 'none'}
                    />
                </button>
            ))}
        </div>
    );

    return (
        <div className="text-slate-500 pb-12">
            {/* Header */}
            <div className="mb-6 p-6 bg-white rounded-2xl border-2 border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-1">Reviews</h1>
                    <p className="text-slate-500">
                        Manage customer reviews shown on your website. {reviews.length} review{reviews.length !== 1 ? 's' : ''} total.
                    </p>
                </div>
                <div className="flex gap-3">
                    {showForm && (
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-sm shadow-sm hover:shadow-md"
                        >
                            <Save size={18} />
                            {editingId ? 'Update Review' : 'Add Review'}
                        </button>
                    )}
                    <button
                        onClick={() => { 
                            if (showForm) {
                                resetForm();
                            } else {
                                resetForm(); 
                                setShowForm(true);
                            }
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-sm"
                    >
                        {showForm ? <X size={16} /> : <Plus size={16} />}
                        {showForm ? 'Cancel' : 'Add Review'}
                    </button>
                </div>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-6 mb-6">
                    <div className="mb-6 pb-4 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800">
                            {editingId ? 'Edit Review' : 'Add New Review'}
                        </h3>
                    </div>

                    <div className="space-y-5">
                        {/* Customer Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Customer Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                                placeholder="e.g., Emma Roberts"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none text-sm text-slate-800 transition-colors"
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
                            <StarRating value={formData.rating} onChange={v => setFormData(f => ({ ...f, rating: v }))} size={26} />
                        </div>

                        {/* Review Text */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Review Text <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.review}
                                onChange={e => setFormData(f => ({ ...f, review: e.target.value }))}
                                placeholder="Enter the customer's review text here..."
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none text-sm text-slate-800 resize-none transition-colors"
                            />
                        </div>

                        {/* Profile Photo */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Customer Photo</label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 flex-shrink-0 bg-slate-50 flex items-center justify-center">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Star size={28} className="text-slate-300" />
                                    )}
                                </div>
                                <div className="flex-1 flex gap-2">
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            key={editingId || 'new'}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <div className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-green-600 transition-colors text-sm text-slate-600 font-medium text-center bg-white">
                                            {formData.image ? 'Change Photo' : 'Upload Photo'}
                                        </div>
                                    </label>
                                    {formData.image && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData(f => ({ ...f, image: '' }))}
                                            className="px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-red-600 hover:text-red-600 transition-colors text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Visibility Toggle */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Visibility</label>
                            <label className="relative inline-flex items-center cursor-pointer gap-3 p-3 rounded-xl border-2 border-slate-200 hover:border-green-600 transition-colors">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.visible !== false}
                                    onChange={e => setFormData(f => ({ ...f, visible: e.target.checked }))}
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[14px] after:left-[14px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                <span className="text-sm font-medium text-slate-700">
                                    {formData.visible !== false ? 'Visible on Website' : 'Hidden from Website'}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews Grid */}
            {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-slate-100 p-16 text-center">
                    <Star size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500 font-medium">No reviews yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add your first review using the button above.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {reviews.map(review => (
                        <div
                            key={review.id}
                            className={`bg-white rounded-2xl border-2 p-6 flex flex-col gap-4 transition-all duration-200 ${
                                review.visible === false 
                                    ? 'border-slate-200 opacity-60 hover:border-slate-300 hover:shadow-sm' 
                                    : 'border-slate-100 hover:border-green-600 hover:shadow-lg'
                            }`}
                        >
                            {/* Top: Avatar + Name + Rating */}
                            <div className="flex items-start gap-3.5">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 flex-shrink-0 bg-slate-100 flex items-center justify-center">
                                    {review.image ? (
                                        <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-slate-600 font-bold text-xl">
                                            {review.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <p className="font-bold text-slate-800 text-base">{review.name}</p>
                                        {review.visible === false && (
                                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-medium">Hidden</span>
                                        )}
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i <= (review.rating || 5) ? 'text-yellow-400' : 'text-slate-200'}
                                                fill={i <= (review.rating || 5) ? 'currentColor' : 'none'}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Review Text */}
                            <p className="text-sm text-slate-600 leading-relaxed flex-1 line-clamp-4">{review.review}</p>

                            {/* Footer: Date + Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className="text-xs text-slate-400 font-medium">
                                    {new Date(review.createdAt).toLocaleDateString('en-GB')}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleToggleVisible(review)}
                                        title={review.visible === false ? 'Show on website' : 'Hide from website'}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            review.visible === false
                                                ? 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                                                : 'text-green-600 hover:bg-green-50 hover:scale-110'
                                        }`}
                                    >
                                        {review.visible === false ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(review)}
                                        title="Edit"
                                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        title="Delete"
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
