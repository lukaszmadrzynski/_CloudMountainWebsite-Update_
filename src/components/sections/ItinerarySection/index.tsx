import * as React from 'react';
import classNames from 'classnames';
import Section from '../Section';
import TitleBlock from '../../blocks/TitleBlock';
import { Badge } from '../../atoms';

interface ScheduleItem {
    period: string;
    activities: string[];
    icon?: string;
}

interface Day {
    day: number;
    title: string;
    meals?: { type: string; description: string }[];
    schedule?: ScheduleItem[];
    accommodation?: string;
}

interface ItinerarySectionProps {
    elementId?: string;
    colors?: string;
    backgroundImage?: any;
    badge?: any;
    title?: any;
    subtitle?: string;
    days?: Day[];
    styles?: any;
    enableAnnotations?: boolean;
    timelineLayout?: boolean;
    accentColors?: {
        primary?: string;
        secondary?: string;
        accent?: string;
        morning?: string;
        afternoon?: string;
        evening?: string;
    };
}

// Icon paths for time periods
const TimeIconPaths = {
    morning: '/images/itinerary/morning.png',
    afternoon: '/images/itinerary/afternoon.png',
    evening: '/images/itinerary/evening.png',
};

export default function ItinerarySection(props: ItinerarySectionProps) {
    const {
        elementId,
        colors,
        backgroundImage,
        badge,
        title,
        subtitle,
        days = [],
        styles = {},
        enableAnnotations,
        timelineLayout = true,
        accentColors = {}
    } = props;
    
    // Ref for the inner content wrapper
    const outerRef = React.useRef<HTMLDivElement>(null);
    
    // Expose scrollToItinerary function via window for external access
    React.useEffect(() => {
        // Set a unique key based on elementId or a counter
        const key = `scrollToItinerary_${elementId || 'default'}`;
        (window as any)[key] = () => {
            // Use outerRef (the inner div with class "w-full max-w-5xl mx-auto")
            let targetEl: HTMLElement | null = outerRef.current;
            
            // Fallback to the section wrapper with class sb-component-itinerary-section
            if (!targetEl) {
                targetEl = document.querySelector('.sb-component-itinerary-section') as HTMLElement;
            }
            
            // Final fallback: find any element containing "EcoTour Itinerary" text
            if (!targetEl) {
                const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                for (const heading of headings) {
                    if (heading.textContent?.includes('EcoTour Itinerary')) {
                        targetEl = heading.closest('.sb-component-section') as HTMLElement;
                        break;
                    }
                }
            }
            
            if (targetEl) {
                const headerOffset = 80;
                const top = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        };
        
        // Also set the generic key for backwards compatibility
        (window as any).scrollToItinerary = (window as any)[key];
        
        return () => {
            delete (window as any)[key];
            // Only delete generic if it points to this key
            if ((window as any).scrollToItinerary === (window as any)[key]) {
                delete (window as any).scrollToItinerary;
            }
        };
    }, [elementId]);

    // Default colors - use user-specified accent colors
    const primaryColor = accentColors.primary || '#5ebb46';
    const secondaryColor = accentColors.secondary || '#007dbd';
    const accentColor = accentColors.accent || '#02558b';
    
    // Map accentColors to the expected property names for getPeriodConfig
    const periodColors = {
        primary: accentColors.morning || '#01aed9',
        secondary: accentColors.afternoon || '#007dbd',
        accent: accentColors.evening || '#02558b'
    };

    // Get style config for each time period using user-specified colors
    const getPeriodConfig = (period: string) => {
        const lowerPeriod = period.toLowerCase();
        if (['morning', 'breakfast'].includes(lowerPeriod)) {
            return {
                bg: periodColors.primary + '20',
                border: periodColors.primary,
                textColor: '#5ebb46',
                iconPath: TimeIconPaths.morning,
                label: 'Morning',
                caption: 'Morning Activities'
            };
        } else if (['afternoon', 'lunch'].includes(lowerPeriod)) {
            return {
                bg: periodColors.secondary + '20',
                border: periodColors.secondary,
                textColor: '#007dbd',
                iconPath: TimeIconPaths.afternoon,
                label: 'Afternoon',
                caption: 'Afternoon Activities'
            };
        } else if (['evening', 'dinner', 'night'].includes(lowerPeriod)) {
            return {
                bg: periodColors.accent + '20',
                border: periodColors.accent,
                textColor: '#02558b',
                iconPath: TimeIconPaths.evening,
                label: 'Evening',
                caption: 'Evening Activities'
            };
        } else {
            return {
                bg: primaryColor + '20',
                border: primaryColor,
                textColor: '#5ebb46',
                iconPath: null,
                label: period,
                caption: period + ' Activities'
            };
        }
    };

    return (
        <Section
            elementId={elementId}
            className="sb-component-itinerary-section"
            colors={colors}
            backgroundImage={backgroundImage}
            styles={styles?.self}
        >
            <div ref={outerRef} className="w-full max-w-5xl mx-auto">
                {badge && <Badge {...badge} className="text-center block mb-1" />}
                {title && (
                    <TitleBlock
                        {...title}
                        className="text-center"
                    />
                )}
                {subtitle && (
                    <p className="text-center text-gray-600 mt-2 mb-4">
                        {subtitle}
                    </p>
                )}

                {timelineLayout ? (
                    <div className="relative">
                        <div className="space-y-8">
                            {days.map((day: Day, index: number) => (
                                <TimelineDayCard
                                    key={index}
                                    day={day}
                                    index={index}
                                    isFirst={index === 0}
                                    getPeriodConfig={getPeriodConfig}
                                    primaryColor={primaryColor}
                                    secondaryColor={secondaryColor}
                                    accentColors={accentColors}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {days.map((day: Day, index: number) => (
                            <DayAccordion
                                key={index}
                                day={day}
                                defaultOpen={index === 0}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Section>
    );
}

interface TimelineDayCardProps {
    day: Day;
    index: number;
    isFirst?: boolean;
    getPeriodConfig: (period: string) => {
        bg: string;
        border: string;
        textColor: string;
        iconPath: string | null;
        label: string;
        caption: string;
    };
    primaryColor: string;
    secondaryColor: string;
    accentColors: {
        primary?: string;
        secondary?: string;
        accent?: string;
        morning?: string;
        afternoon?: string;
        evening?: string;
    };
}

function TimelineDayCard({ day, index, isFirst, getPeriodConfig, primaryColor, secondaryColor, accentColors }: TimelineDayCardProps) {
    // Always expanded - no collapse functionality
    const isOpen = true;
    
    // Use the provided accent colors for time periods
    const getTimePeriodConfig = (period: string) => {
        const lowerPeriod = period.toLowerCase();
        
        // Special handling for "Morning or Afternoon" (half-day tours)
        if (lowerPeriod.includes('morning') && lowerPeriod.includes('afternoon')) {
            return {
                border: primaryColor,
                textColor: '#5ebb46',
                iconPath: 'both', // Special marker for both icons
                label: 'Morning or Afternoon'
            };
        }
        
        if (['morning', 'breakfast'].includes(lowerPeriod)) {
            return {
                border: accentColors.morning || '#01aed9',
                textColor: '#01aed9',
                iconPath: TimeIconPaths.morning,
                label: 'Morning'
            };
        } else if (['afternoon', 'lunch'].includes(lowerPeriod)) {
            return {
                border: accentColors.afternoon || '#007dbd',
                textColor: '#007dbd',
                iconPath: TimeIconPaths.afternoon,
                label: 'Afternoon'
            };
        } else if (['evening', 'dinner', 'night'].includes(lowerPeriod)) {
            return {
                border: accentColors.evening || '#02558b',
                textColor: '#02558b',
                iconPath: TimeIconPaths.evening,
                label: 'Evening'
            };
        } else {
            return {
                border: primaryColor,
                textColor: '#5ebb46',
                iconPath: null,
                label: period
            };
        }
    };

    // Helper function to format day label
    const formatDayLabel = (dayValue: number | string) => {
        // If it's a string (like "Half-Day" or "One Day"), use it as-is
        if (typeof dayValue === 'string') {
            return dayValue;
        }
        // If it's a number
        const num = dayValue as number;
        const numberWords: { [key: number]: string } = {
            1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
            6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten'
        };
        const word = numberWords[num] || num.toString();
        return `${word}`;
    };
    const getTimeGroups = () => {
        const groups: { period: string; config: any; activities: string[] }[] = [];

        if (day.schedule) {
            day.schedule.forEach((item) => {
                const config = getPeriodConfig(item.period);
                groups.push({
                    period: item.period,
                    config,
                    activities: item.activities
                });
            });
        }

        // Add accommodation as last item (merged with Evening)
        if (day.accommodation) {
            const lastGroup = groups[groups.length - 1];
            if (lastGroup && lastGroup.config.label === 'Evening') {
                lastGroup.activities.push(day.accommodation);
            } else {
                groups.push({
                    period: 'Rest',
                    config: {
                        border: secondaryColor,
                        textColor: '#5ebb46',
                        iconPath: TimeIconPaths.evening,
                        label: 'Rest'
                    },
                    activities: [day.accommodation]
                });
            }
        }

        return groups;
    };

    const timeGroups = getTimeGroups();

    // Use the formatDayLabel helper for displaying day names
    const dayLabel = formatDayLabel(day.day);
    
    // Check if it's a half-day or special day (string values)
    const isHalfDay = typeof day.day === 'string' && day.day.toLowerCase().includes('half');
    
    // Get time period config function (defined below in component)
    const getTimePeriodConfigForHalfDay = (period: string) => {
        const lowerPeriod = period.toLowerCase();
        if (['morning or afternoon', 'morning', 'afternoon'].includes(lowerPeriod)) {
            // For half-day, show both morning and afternoon icons
            return {
                border: primaryColor,
                textColor: '#5ebb46',
                iconPath: null, // Will show both icons below
                label: period
            };
        }
        return getTimePeriodConfig(period);
    };
    
    // For half-day tours, get both morning and afternoon icons
    const showBothIcons = isHalfDay;

    return (
        <div className="relative">
            {/* Day card - always expanded, no shading */}
            <div className={`bg-transparent rounded-2xl overflow-hidden ml-0${isFirst ? ' mt-6' : ''}`}>
                {/* Day header - centered */}
                <div className="w-full px-4 py-4 flex flex-col items-center justify-center text-center">
                    <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {dayLabel}
                    </h3>
                    <p className="text-gray-600 mt-1 font-medium">{day.title}</p>
                </div>

                {/* Always visible schedule - no collapse */}
                <div className="max-h-[3000px] opacity-100">
                    <div className="px-4 pb-6 space-y-4">
                        {timeGroups.map((group, idx) => (
                            <TimeSectionCard
                                key={idx}
                                config={getTimePeriodConfig(group.period)}
                                period={group.period}
                                activities={group.activities}
                                showBothIcons={showBothIcons}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface TimeSectionCardProps {
    config: {
        border: string;
        textColor: string;
        iconPath: string | null;
        label: string;
    };
    period: string;
    activities: string[];
    showBothIcons?: boolean;
}

function TimeSectionCard({ config, period, activities, showBothIcons = false }: TimeSectionCardProps) {
    return (
        <div className="relative">
            <div
                className="flex flex-col sm:flex-row rounded-xl overflow-hidden bg-white items-center"
                style={{ border: `2px solid ${config.border}` }}
            >
                {/* Left section: Icon + Label side by side */}
                <div 
                    className="sm:w-32 flex flex-row sm:flex-col items-center justify-center p-3 sm:p-4 gap-2 sm:gap-2 bg-transparent"
                >
                    {/* Check for "both" icon marker (for half-day tours) - show icons stacked */}
                    {config.iconPath === 'both' ? (
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0">
                                <img
                                    src={TimeIconPaths.morning}
                                    alt="Morning"
                                    className="w-10 sm:w-12 h-10 sm:h-12 object-contain"
                                />
                            </div>
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0">
                                <img
                                    src={TimeIconPaths.afternoon}
                                    alt="Afternoon"
                                    className="w-10 sm:w-12 h-10 sm:h-12 object-contain"
                                />
                            </div>
                        </div>
                    ) : config.iconPath ? (
                        /* Single icon (Morning, Afternoon, or Evening) */
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0">
                            <img
                                src={config.iconPath}
                                alt={config.label}
                                className="w-12 sm:w-14 h-12 sm:h-14 object-contain"
                                style={{ color: config.border }}
                            />
                        </div>
                    ) : (
                        /* Fallback icon for unknown periods */
                        <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ border: `2px solid ${config.border}` }}
                        >
                            <svg className="w-10 sm:w-12 h-10 sm:h-12" style={{ color: config.border }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </div>
                    )}
                    {/* Time period label - special handling for "Morning or Afternoon" */}
                    {config.label === 'Morning or Afternoon' ? (
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-sm sm:text-base" style={{ color: '#01aed9' }}>Morning</span>
                            <span className="font-medium text-xs text-gray-500">or</span>
                            <span className="font-bold text-sm sm:text-base" style={{ color: '#007dbd' }}>Afternoon</span>
                        </div>
                    ) : (
                        <h4
                            className="font-bold text-sm sm:text-base"
                            style={{ color: config.textColor }}
                        >
                            {config.label}
                        </h4>
                    )}
                </div>

                {/* Right section: Activities description */}
                <div className="flex-1 p-4 sm:p-5">
                    {activities.map((activity, actIdx) => (
                        <p key={actIdx} className="text-gray-700 leading-relaxed last:mb-0">
                            {activity}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DayAccordion({ day, defaultOpen = false }: { day: Day; defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    // Helper function to get badge style based on period type
    const getPeriodStyle = (period: string) => {
        const lowerPeriod = period.toLowerCase();
        if (['morning', 'breakfast'].includes(lowerPeriod)) {
            return { bg: 'bg-amber-100', textColor: '#92400e', iconPath: TimeIconPaths.morning };
        } else if (['afternoon', 'lunch'].includes(lowerPeriod)) {
            return { bg: 'bg-orange-100', textColor: '#9a3412', iconPath: TimeIconPaths.afternoon };
        } else if (['evening', 'dinner', 'night'].includes(lowerPeriod)) {
            return { bg: 'bg-blue-100', textColor: '#1e40af', iconPath: TimeIconPaths.evening };
        } else {
            return { bg: 'bg-green-100', textColor: '#166534', iconPath: null };
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
                className="w-full px-4 py-4 text-left flex items-center gap-4 bg-gradient-to-r from-green-50 to-white hover:from-green-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="w-20 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-white"
                    style={{ backgroundColor: '#5ebb46' }}
                >
                    Day {day.day}
                </span>
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{day.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {day.schedule?.map(s => s.period).join(' · ')}
                    </p>
                </div>
                <span className={classNames(
                    'text-2xl font-light transition-transform duration-200',
                    isOpen && 'rotate-45'
                )}
                    style={{ color: '#5ebb46' }}
                >
                    +
                </span>
            </button>
            <div className={classNames(
                'overflow-hidden transition-all duration-300 ease-in-out',
                isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
            )}>
                <div className="px-4 pb-6 pt-2">
                    <div className="space-y-4">
                        {day.schedule?.map((period, idx) => {
                            const style = getPeriodStyle(period.period);
                            return (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-28 flex-shrink-0">
                                        <span
                                            className={classNames(
                                                'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
                                                style.bg
                                            )}
                                            style={{ color: style.textColor }}
                                        >
                                            {style.iconPath && (
                                                <img
                                                    src={style.iconPath}
                                                    alt={period.period}
                                                    className="w-4 h-4 object-contain"
                                                />
                                            )}
                                            {period.period}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <ul className="space-y-1">
                                            {period.activities.map((activity, actIdx) => (
                                                <li key={actIdx} className="text-gray-700 flex items-start gap-2">
                                                    <span className="mt-1.5" style={{ color: '#5ebb46' }}>
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <circle cx="10" cy="10" r="4"/>
                                                        </svg>
                                                    </span>
                                                    <span>{activity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                        {day.meals && day.meals.length > 0 && (
                            <div className="flex gap-4">
                                <div className="w-28 flex-shrink-0">
                                    <span
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                                        style={{ backgroundColor: '#fed7aa', color: '#9a3412' }}
                                    >
                                        {TimeIconPaths.afternoon && (
                                            <img
                                                src={TimeIconPaths.afternoon}
                                                alt="lunch"
                                                className="w-4 h-4 object-contain"
                                            />
                                        )}
                                        Lunch
                                    </span>
                                </div>
                                <div className="flex-1 text-gray-600">
                                    {day.meals[0].description}
                                </div>
                            </div>
                        )}
                        {day.accommodation && (
                            <div className="flex gap-4 items-center pt-2 border-t border-gray-100">
                                <div className="w-28 flex-shrink-0">
                                    <span
                                        className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                                        style={{ backgroundColor: '#02558b' }}
                                    >
                                        Stay
                                    </span>
                                </div>
                                <div className="flex-1 text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4" style={{ color: '#02558b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                    </svg>
                                    {day.accommodation}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
