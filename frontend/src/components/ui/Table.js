import React from 'react';

export const Table = ({ children, className = '' }) => (
    <div className={`glass-table-container ${className}`}>
        <div className="overflow-x-auto">
            <table className="glass-table">
                {children}
            </table>
        </div>
    </div>
);

export const Thead = ({ children }) => (
    <thead>{children}</thead>
);

export const Tbody = ({ children }) => (
    <tbody>{children}</tbody>
);

export const Tr = ({ children, className = '' }) => (
    <tr className={className}>{children}</tr>
);

export const Th = ({ children, className = '' }) => (
    <th className={className}>{children}</th>
);

export const Td = ({ children, className = '' }) => (
    <td className={className}>{children}</td>
);

export const StatusBadge = ({ status }) => {
    const text = status === null || status === undefined || status === "" ? "Unknown" : String(status);
    const safeStatus = text.toLowerCase();

    let statusClass = 'bg-[rgba(255,255,255,0.1)] text-[rgba(245,245,245,0.7)] border border-[rgba(255,255,255,0.1)]'; // Unknown default

    if (safeStatus === 'pending') {
        statusClass = 'status-pending';
    } else if (safeStatus === 'delivered' || safeStatus === 'active' || safeStatus === 'completed') {
        statusClass = 'status-delivered';
    } else if (safeStatus === 'cancelled' || safeStatus === 'inactive' || safeStatus === 'failed') {
        statusClass = 'status-cancelled';
    }

    const displayText = text !== "Unknown" ? safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1) : text;

    return (
        <span className={`status-badge ${statusClass}`}>
            {displayText}
        </span>
    );
};
