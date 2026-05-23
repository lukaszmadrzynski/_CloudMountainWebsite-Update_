import * as React from 'react';

export default function Play({ className, ...props }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-sb-field-path={props['data-sb-field-path']}>
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}
