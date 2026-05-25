import * as React from 'react';
import classNames from 'classnames';

interface StickyBookingBarProps {
    price?: string;
    priceFrom?: string;
    bookingUrl?: string;
    buttonText?: string;
    tourTitle?: string;
    /** Height offset for sticky header - pass header height to position below header */
    headerHeight?: number;
}

export default function StickyBookingBar({
    price = '$340',
    priceFrom = 'From',
    bookingUrl = '/book',
    buttonText = 'Book This Ecotour',
    tourTitle = '',
    headerHeight = 0
}: StickyBookingBarProps) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    
    // Dynamic header height - auto-detect actual header height
    const [actualHeaderHeight, setActualHeaderHeight] = React.useState(72);

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollTrigger = 500;
            setIsVisible(window.scrollY > scrollTrigger);
            setIsScrolled(window.scrollY > 100);
        };

        // Dynamically calculate header height
        const calculateHeaderHeight = () => {
            // Try to find the header element
            const header = document.querySelector('header');
            if (header) {
                const height = header.getBoundingClientRect().height;
                setActualHeaderHeight(height);
            }
        };

        // Calculate on mount and when DOM is ready
        calculateHeaderHeight();
        
        // Also recalculate on window resize (header height might change)
        window.addEventListener('resize', calculateHeaderHeight);

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', calculateHeaderHeight);
        };
    }, []);

    // Calculate top position: passed headerHeight + actual header height
    const bookingBarTop = headerHeight + actualHeaderHeight;
    
    // Z-index: 40 when hidden (below header z-50), 60 when visible (above header)
    const hiddenZIndex = 40;
    const visibleZIndex = 60;
    const currentZIndex = isVisible ? visibleZIndex : hiddenZIndex;

    return (
        <>
            {/* Desktop: Floating bar on the right side */}
            <div
                className={classNames(
                    'fixed right-0 transition-all duration-300 hidden lg:block',
                    'bg-gray-900',
                    'shadow-lg rounded-l-xl',
                    isScrolled && 'shadow-xl',
                    isVisible ? 'translate-x-0' : 'translate-x-full',
                    'print:hidden'
                )}
                style={{ top: `${bookingBarTop}px`, zIndex: currentZIndex }}
            >
                <div className="p-4 flex flex-col items-start justify-between gap-3 min-w-[200px] h-full">
                    {/* Tour Title - Bold */}
                    <span className="text-white font-bold text-sm truncate max-w-[200px]">
                        {tourTitle || 'Book Your EcoTour'}
                    </span>
                    
                    {/* Price */}
                    <div className="flex items-baseline justify-start gap-1">
                        <span className="text-white/60 text-xs">{priceFrom}</span>
                        <span className="text-2xl font-bold text-white">{price}</span>
                        <span className="text-white/60 text-sm">/person</span>
                    </div>
                    
                    {/* Button - Secondary Style */}
                    <a
                        href={bookingUrl}
                        className={classNames(
                            'px-6 py-2.5 rounded-lg font-semibold',
                            'border-2 border-[#5ebb46] text-[#5ebb46]',
                            'hover:bg-[#5ebb46]/10',
                            'transition-all duration-200',
                            'flex items-center gap-2',
                            'whitespace-nowrap',
                            'self-start'
                        )}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {buttonText}
                    </a>
                </div>
            </div>

            {/* Mobile only (below md): Price + Book Now only */}
            <div
                className={classNames(
                    'fixed left-0 right-0 transition-all duration-300 md:hidden',
                    'bg-gray-900',
                    'shadow-lg',
                    isScrolled && 'shadow-xl',
                    isVisible ? 'translate-y-0' : '-translate-y-full',
                    'print:hidden'
                )}
                style={{ top: `${bookingBarTop}px`, zIndex: currentZIndex }}
            >
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-end gap-4">
                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-white/60 text-xs">{priceFrom}</span>
                        <span className="text-lg font-bold text-white">{price}</span>
                        <span className="text-white/60 text-xs">/person</span>
                    </div>
                    
                    {/* Primary Button */}
                    <a
                        href={bookingUrl}
                        className={classNames(
                            'px-4 py-2 rounded-lg font-semibold text-white',
                            'bg-[#5ebb46]',
                            'hover:bg-[#47773d]',
                            'shadow-md hover:shadow-lg',
                            'transition-all duration-200',
                            'flex items-center gap-2',
                            'whitespace-nowrap'
                        )}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Book Now
                    </a>
                </div>
            </div>

            {/* Tablet (md to lg): Tour name + Price + Book Now */}
            <div
                className={classNames(
                    'fixed left-0 right-0 transition-all duration-300 hidden md:block lg:hidden',
                    'bg-gray-900',
                    'shadow-lg',
                    isScrolled && 'shadow-xl',
                    isVisible ? 'translate-y-0' : '-translate-y-full',
                    'print:hidden'
                )}
                style={{ top: `${bookingBarTop}px`, zIndex: currentZIndex }}
            >
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
                    {/* Tour Title */}
                    <span className="text-white font-bold text-sm truncate max-w-[200px]">
                        {tourTitle || 'Book Your EcoTour'}
                    </span>

                    {/* Price & CTA */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-baseline gap-1">
                            <span className="text-white/60 text-xs">{priceFrom}</span>
                            <span className="text-xl font-bold text-white">{price}</span>
                            <span className="text-white/60 text-xs">/person</span>
                        </div>
                        
                        {/* Primary Button */}
                        <a
                            href={bookingUrl}
                            className={classNames(
                                'px-4 py-2 rounded-lg font-semibold text-white',
                                'bg-[#5ebb46]',
                                'hover:bg-[#47773d]',
                                'shadow-md hover:shadow-lg',
                                'transition-all duration-200',
                                'flex items-center gap-2',
                                'whitespace-nowrap'
                            )}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Book Now
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}