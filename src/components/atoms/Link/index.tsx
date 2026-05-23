import * as React from 'react';
import NextLink from 'next/link';

// Scroll offset for anchor links (50px for header clearance)
const ANCHOR_SCROLL_OFFSET = 50;

export default function Link(props: { 
    children: React.ReactNode; 
    href?: string; 
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void; 
    [key: string]: any 
}) {
    const { children, href, onClick, ...other } = props;
    // Handle anchor links (e.g., #partner-form-section)
    const isAnchor = href?.startsWith('#');
    
    // Create anchor-specific onClick handler
    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const targetId = href.substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - ANCHOR_SCROLL_OFFSET;
            window.scrollTo({ top, behavior: 'smooth' });
        }
        onClick?.(e);
    };
    
    if (isAnchor) {
        return (
            <a 
                href={href} 
                onClick={handleAnchorClick}
                {...other}
            >
                {children}
            </a>
        );
    }

    // Pass Any internal link to Next.js Link, for anything else, use <a> tag
    const internal = /^\/(?!\/)/.test(href);
    if (internal) {
        return (
            <NextLink href={href} {...other}>
                {children}
            </NextLink>
        );
    }

    // External links - open in new tab for better user experience
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...other}>
            {children}
        </a>
    );
}
