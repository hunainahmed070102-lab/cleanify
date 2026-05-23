import React from 'react';

export default function DataTable({ columns, data, keyField, emptyMessage = "No records found", onRowClick }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        {columns.map((col, index) => (
                            <th 
                                key={index} 
                                className={`p-4 text-xs font-semibold text-slate-700 whitespace-nowrap ${col.hiddenOnMobile ? 'hidden md:table-cell' : ''} ${col.hiddenOnTablet ? 'hidden lg:table-cell' : ''} ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}`}
                                style={{ width: col.width }}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr 
                                key={row[keyField] || rowIndex} 
                                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {columns.map((col, colIndex) => (
                                    <td 
                                        key={colIndex} 
                                        className={`p-4 ${col.hiddenOnMobile ? 'hidden md:table-cell' : ''} ${col.hiddenOnTablet ? 'hidden lg:table-cell' : ''} ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}`}
                                    >
                                        {col.render ? col.render(row) : <span className="text-sm text-slate-800">{row[col.accessor]}</span>}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="p-8 text-center text-slate-500 text-sm">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
