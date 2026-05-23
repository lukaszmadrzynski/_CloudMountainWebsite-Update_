import * as React from 'react';

export default function Location({ className, ...props }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" data-sb-field-path={props['data-sb-field-path']}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M32 8c-9.94 0-18 8.06-18 18 0 15.25 18 30 18 30s18-14.75 18-30c0-9.94-8.06-18-18-18z" />
            <circle cx="32" cy="26" r="8" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="1.5" d="M32 20v2M32 30v2M26 26h2M36 26h2" />
            <path strokeLinecap="round" strokeWidth="1.5" d="M28 24l1.5 2 2-1.5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 56l8-10 6 7 10-14 12 17" />
            <path strokeLinecap="round" strokeWidth="2" d="M18 54l4-5 3 4 5-7" />
        </svg>
    );
}