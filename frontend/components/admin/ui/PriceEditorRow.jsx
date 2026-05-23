import React, { useState, useEffect } from 'react';
import { Check, X, Edit2 } from 'lucide-react';

export default function PriceEditorRow({ service, onSave, onToggleStatus }) {
    const [isEditing, setIsEditing] = useState(false);
    const [price, setPrice] = useState(service.price);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        setHasUnsavedChanges(price !== service.price);
    }, [price, service.price]);

    const handleSave = () => {
        onSave(service._id, { price: Number(price) });
        setIsEditing(false);
        setHasUnsavedChanges(false);
    };

    const handleCancel = () => {
        setPrice(service.price);
        setIsEditing(false);
        setHasUnsavedChanges(false);
    };

    return (
        <tr className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${hasUnsavedChanges ? 'bg-green-50/30' : ''}`}>
            <td className="p-4">
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">{service.name}</span>
                    <span className="text-xs text-slate-500">{service.category}</span>
                </div>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <span className="text-slate-500">£</span>
                    {isEditing ? (
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-24 px-2 py-1 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-green-600/20 text-slate-800 font-semibold bg-white"
                            autoFocus
                        />
                    ) : (
                        <span className={`font-semibold ${hasUnsavedChanges ? 'text-green-600' : 'text-slate-800'}`}>
                            {price}
                        </span>
                    )}
                </div>
                {hasUnsavedChanges && !isEditing && (
                    <span className="text-[10px] text-green-600 font-medium block mt-1">Unsaved changes</span>
                )}
            </td>
            <td className="p-4">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={service.isActive}
                        onChange={() => onToggleStatus(service._id, !service.isActive)}
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                </label>
            </td>
            <td className="p-4">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleSave}
                            className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                            title="Save"
                        >
                            <Check size={16} />
                        </button>
                        <button 
                            onClick={handleCancel}
                            className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded transition-colors"
                            title="Cancel"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Edit2 size={14} /> Edit
                        </button>
                        {hasUnsavedChanges && (
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Check size={14} /> Save
                            </button>
                        )}
                    </div>
                )}
            </td>
        </tr>
    );
}
