import React from 'react';

export const Button = ({ children, className = '', variant = 'primary', ...props }) => {
    return (
        <button
            className={`btn-primary flex items-center justify-center gap-2 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
