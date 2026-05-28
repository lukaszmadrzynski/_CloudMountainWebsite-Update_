import * as React from 'react';
import classNames from 'classnames';

interface EcotoursHeroSectionProps {
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

export default function EcotoursHeroSection(props: EcotoursHeroSectionProps) {
    const { elementId, badge, title, subtitle, text, actions = [], media, colors, backgroundImage, styles = {} } = props;

    return (
        <section
            id={elementId}
            className="relative overflow-hidden w-full"
            data-sb-field-path=".hero"
        >
            {/* Full-width image container - mobile taller than desktop */}
            {media?.url && (
                <div 
                    className="relative w-full" 
                    style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
                >
                    <img
                        src={media.url}
                        alt={media.altText || ''}
                        className="w-full object-cover EcotoursHeroSection-img"
                        data-sb-field-path=".media.url"
                    />
                </div>
            )}
        </section>
    );
}