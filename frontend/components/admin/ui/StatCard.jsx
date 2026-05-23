import React from 'react';

export default function StatCard({ title, value, icon: Icon, highlight, highlightText, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-5 transition-all duration-200 shadow-sm ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${highlight ? 'border-green-200 bg-green-50/20' : 'hover:border-slate-300'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
          highlight 
            ? 'bg-green-100 text-green-600' 
            : 'bg-slate-100 text-slate-500'
        }`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        {highlightText && (
          <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
            {highlightText}
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-green-600' : 'text-slate-800'}`}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}
