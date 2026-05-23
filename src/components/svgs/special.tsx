import * as React from 'react';

export default function Special({ className, ...props }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" data-sb-field-path={props['data-sb-field-path']}>
            <path strokeLinejoin="round" strokeWidth="3" d="M32 6l6.18 12.52L50 20.06l-9 8.78 2.12 12.4L32 35.5l-11.12 5.74L23 28.84l-9-8.78 11.82-1.54L32 6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M32 28v12" />
            <path strokeLinecap="round" strokeWidth="2" d="M32 36c0-4 4-6 8-6" />
            <path strokeLinecap="round" strokeWidth="2" d="M32 40c0-3-3-5-6-5" />
        </svg>
    );
}