import * as React from 'react';

export default function ActivityLevel({ className, ...props }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" data-sb-field-path={props['data-sb-field-path']}>
            <circle cx="28" cy="14" r="6" strokeWidth="2.5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M28 20v12" />
            <path strokeLinecap="round" strokeWidth="2.5" d="M28 24l-8 6" />
            <path strokeLinecap="round" strokeWidth="2.5" d="M28 24l6 2" />
            <rect x="32" y="22" width="8" height="12" rx="2" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="1.5" d="M36 22v-3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M28 32l-6 14" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M28 32l10 10" />
            <path strokeLinecap="round" strokeWidth="1.5" d="M12 24l-4 2M14 30l-6 1M12 36l-4-2" />
            <path strokeLinecap="round" strokeWidth="2" d="M8 52h48" />
            <path strokeLinecap="round" strokeWidth="1.5" d="M16 52v-3M20 52v-4M24 52v-2" />
            <path strokeLinecap="round" strokeWidth="1.5" d="M40 52v-4M44 52v-3M48 52v-2" />
        </svg>
    );
}
