import React from 'react';

export const Input = ({ className = '', ...props }) => {
    return (
        <input
            className={`glass-input w-full ${className}`}
            {...props}
        />
    );
};

export const Select = ({ className = '', children, ...props }) => {
    return (
        <select
            className={`glass-input w-full appearance-none bg-brand-bg ${className}`}
            {...props}
        >
            {children}
        </select>
    );
};
