import * as React from 'react';
import Section from '../Section';
import TitleBlock from '../../blocks/TitleBlock';
import { Badge } from '../../atoms';
import { iconMap } from '../../svgs';

interface KeyDetail {
    icon: string;
    title: string;
    subtitle: string;
    highlight?: string;
}

interface KeyDetailsSectionProps {
    elementId?: string;
    colors?: string;
    backgroundImage?: any;
    badge?: any;
    title?: any;
    subtitle?: string;
    items?: KeyDetail[];
    styles?: any;
}

export default function KeyDetailsSection(props: KeyDetailsSectionProps) {
    const { elementId, colors, backgroundImage, badge, title, subtitle, items = [], styles = {} } = props;

    // Icon display helper - renders image or registered icon with proper styling
    const IconDisplay = ({ iconValue, className }: { iconValue: string; className?: string }) => {
        // Check if iconValue is a URL/path to an image
        if (iconValue && (iconValue.startsWith('/') || iconValue.startsWith('http'))) {
            return (
                <img 
                    src={iconValue} 
                    alt="" 
                    className={className}
                    loading="lazy"
                />
            );
        }
        
        // Otherwise, try to find in iconMap
        const IconComponent = iconMap[iconValue];
        if (!IconComponent) {
            // Fallback icon
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            );
        }
        return <IconComponent className={className} />;
    };

    return (
        <Section
            elementId={elementId}
            className="sb-component-key-details-section"
            colors={colors}
            backgroundImage={backgroundImage}
            styles={styles?.self}
        >
            <div className="w-full max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    {badge && <Badge {...badge} className="mb-4" />}
                    {title && <TitleBlock {...title} />}
                    {subtitle && <p className="text-gray-600 mt-3 text-lg">{subtitle}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl pt-0 pb-4 px-8"
                            data-sb-field-path={`.items.${index}`}
                        >
                            {/* Icon centered at top */}
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-14 h-14 flex items-center justify-center">
                                    <IconDisplay iconValue={item.icon} className="w-10 h-10" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-1 text-center">{item.title}</h3>
                                <p className="text-[#5ebb46] font-semibold text-sm text-center">{item.subtitle}</p>
                            </div>
                            {/* Body text centered */}
                            {item.highlight && (
                                <p 
                                    className="text-gray-500 text-sm leading-relaxed text-center"
                                    dangerouslySetInnerHTML={{ __html: item.highlight }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
