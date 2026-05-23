import * as React from 'react';

export default function Duration({ className, ...props }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" data-sb-field-path={props['data-sb-field-path']}>
            <circle cx="28" cy="32" r="20" strokeWidth="3" />
            <path strokeLinecap="round" strokeWidth="3" d="M28 20v12l8 4" />
            <rect x="36" y="36" width="22" height="22" rx="3" strokeWidth="2.5" />
            <path strokeLinecap="round" strokeWidth="2.5" d="M36 44h22" />
            <path strokeLinecap="round" strokeWidth="2.5" d="M42 32v-4M52 32v-4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M44 50l3 3 7-7" />
        </svg>
    );
}