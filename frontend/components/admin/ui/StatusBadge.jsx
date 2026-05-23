import React from 'react';

export default function StatusBadge({ status }) {
    let textColor = 'text-slate-700';

    if (status === 'Pending') {
        textColor = 'text-amber-700';
    } else if (status === 'Confirmed') {
        textColor = 'text-emerald-700';
    } else if (status === 'In Progress') {
        textColor = 'text-blue-700';
    } else if (status === 'Completed') {
        textColor = 'text-green-700';
    } else if (status === 'Cancelled') {
        textColor = 'text-red-700';
    } else if (status === 'Active') {
        textColor = 'text-green-700';
    } else if (status === 'Inactive') {
        textColor = 'text-slate-500';
    }

    return (
        <span className={`text-sm font-semibold whitespace-nowrap ${textColor}`}>
            {status}
        </span>
    );
}
