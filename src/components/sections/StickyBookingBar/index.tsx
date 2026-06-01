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
    
    // Detect WeChat browser for animation fallback
    const [isWeChat, setIsWeChat] = React.useState(false);
    
    // Dynamic header height - auto-detect actual header height
    const [actualHeaderHeight, setActualHeaderHeight] = React.useState(72);
    const [isHydrated, setIsHydrated] = React.useState(false);

    React.useEffect(() => {
        // Mark as hydrated after first render to avoid layout shift
        setIsHydrated(true);
        
        // Detect WeChat browser
        setIsWeChat(/MicroMessenger/i.test(navigator.userAgent));
        
        const handleScroll = () => {
            const scrollTrigger = 500;
            setIsVisible(window.scrollY > scrollTrigger);
            setIsScrolled(window.scrollY > 100);
        };

        // Debounced header height calculation
        let resizeTimeout: NodeJS.Timeout;
        const calculateHeaderHeight = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const header = document.querySelector('header');
                if (header) {
                    const height = header.getBoundingClientRect().height;
                    setActualHeaderHeight(height);
                }
            }, 100);
        };

        // Calculate on mount and when DOM is ready
        calculateHeaderHeight();
        
        // Also recalculate on window resize (debounced)
        window.addEventListener('resize', calculateHeaderHeight);

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', calculateHeaderHeight);
            clearTimeout(resizeTimeout);
        };
    }, []);

    // Calculate top position: passed headerHeight on server/hydration, actual height after
    const bookingBarTop = isHydrated ? (headerHeight + actualHeaderHeight) : headerHeight;
    
    // Z-index: Desktop bar can be higher (floats on right, doesn't overlap header)
    // Tablet/Mobile bars use fixed z-index 40 (behind header) - they slide from top
    const desktopZIndex = isVisible ? 70 : 60;
    const tabletMobileZIndex = 40;

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
                style={{ top: `${bookingBarTop}px`, zIndex: desktopZIndex }}
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
                    // WeChat: fade only | Others: slide down
                    isWeChat
                        ? (isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none')
                        : (isVisible ? 'translate-y-0' : '-translate-y-full'),
                    'print:hidden'
                )}
                style={{ top: `${bookingBarTop}px`, zIndex: tabletMobileZIndex }}
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
                    // WeChat: fade only | Others: slide down
                    isWeChat
                        ? (isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none')
                        : (isVisible ? 'translate-y-0' : '-translate-y-full'),
                    'print:hidden'
                )}
                style={{ top: `${bookingBarTop}px`, zIndex: tabletMobileZIndex }}
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