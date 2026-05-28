import * as React from 'react';
import classNames from 'classnames';
import { Action, Badge } from '../../atoms';
import { iconMap } from '../../svgs';

interface HomepageHeroSectionProps {
    elementId?: string;
    colors?: string;
    backgroundImage?: any;
    badge?: any;
    title?: any;
    subtitle?: string;
    text?: string;
    actions?: any[];
    media?: any;
    styles?: any;
    className?: string;
}

export default function HomepageHeroSection(props: HomepageHeroSectionProps) {
    const { elementId, badge, title, subtitle, text, actions = [], media, colors, backgroundImage, styles = {} } = props;

    // Determine text color based on colors prop
    const isDarkBg = colors?.includes('dark');
    const textColorClass = isDarkBg ? 'text-white' : 'text-dark';
    const subtitleColorClass = isDarkBg ? 'text-white' : 'text-dark';

    // Darker, more intense text shadow for title and subtitle
    const intenseShadow = { textShadow: '3px 3px 12px rgba(0,0,0,1), -2px -2px 6px rgba(0,0,0,1)' };
    // Even darker shadow for body text
    const mediumShadow = { textShadow: '0 0 15px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,1)' };

    // Button shadow style - darker and more intense
    const buttonShadow = { filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.9))' };

    return (
        <section
            id={elementId}
            className={classNames('relative', 'min-h-[78vh] lg:min-h-screen', 'flex', 'items-center', 'lg:items-start', 'justify-end', 'overflow-hidden', props.className)}
            data-sb-field-path=".hero"
        >
            {/* Background Image - no overlay/shading, left-aligned on all versions */}
            {media?.url && (
                <div className="absolute inset-0">
                    <img
                        src={media.url}
                        alt={media.altText || ''}
                        className="w-full h-full object-cover"
                        data-sb-field-path=".media.url"
                    />
                </div>
            )}

            {/* Content - positioned on right side, centered on mobile/tablet, desktop down 100px */}
            <div className="relative z-10 w-full px-4 sm:px-6 pt-32 sm:pt-56 md:pt-48 lg:pt-48 max-w-4xl mx-auto sm:mx-0 sm:mr-4 lg:mr-0 lg:pr-20 text-center sm:text-right lg:translate-y-[100px] md:-translate-y-[130px]" style={{ marginTop: 'clamp(-80px, -15vw, -150px)' }}>
                
                {title && (
                    <h1 className={classNames("text-3xl sm:text-4xl md:text-6xl lg:text-6xl font-bold mb-3 leading-tight", textColorClass)} style={intenseShadow} data-sb-field-path=".title.text">
                        {title.text}
                    </h1>
                )}
                
                {subtitle && (
                    <h2 className={classNames("text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 leading-tight", subtitleColorClass)} style={intenseShadow} data-sb-field-path=".subtitle">
                        <span dangerouslySetInnerHTML={{ __html: subtitle }} style={{ display: 'block', lineHeight: '1.4', paddingTop: '8px' }} />
                    </h2>
                )}
                
                {text && (
                    <div className="text-center sm:text-right mb-3" style={mediumShadow} data-sb-field-path=".text">
                        <p className={classNames("text-sm sm:text-base md:text-lg max-w-4xl leading-relaxed", subtitleColorClass)}>
                            {text}
                        </p>
                    </div>
                )}
                
                {actions.length > 0 && (
                    <div className="flex flex-wrap justify-center sm:justify-end items-center gap-6" data-sb-field-path=".actions">
                        {/* First button - green primary with darker shadow */}
                        <div style={buttonShadow}>
                            <Action {...actions[0]} label={actions[0]?.label === 'Explore EcoTours' ? 'View Ecotours' : actions[0]?.label} />
                        </div>
                        {/* Second button - transparent with white border, same size as first button */}
                        {actions[1] && (
                            <div style={buttonShadow} className="transition-transform duration-200 ease-in hover:-translate-y-1">
                                <a
                                    href={actions[1]?.url}
                                    className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold min-w-[160px]"
                                    data-sb-field-path=".actions[1]"
                                >
                                    <span>{actions[1]?.label}</span>
                                    {actions[1]?.showIcon && actions[1]?.icon && (() => {
                                        const IconComponent = iconMap[actions[1]?.icon];
                                        return IconComponent ? <IconComponent className="w-[1.25em] h-[1.25em] ml-[0.5em]" /> : null;
                                    })()}
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
