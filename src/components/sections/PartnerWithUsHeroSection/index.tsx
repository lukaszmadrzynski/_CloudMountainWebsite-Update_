import * as React from 'react';
import classNames from 'classnames';

interface PartnerWithUsHeroSectionProps {
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

export default function PartnerWithUsHeroSection(props: PartnerWithUsHeroSectionProps) {
    const { elementId, badge, title, subtitle, text, actions = [], media, colors, backgroundImage, styles = {} } = props;

    return (
        <section
            id={elementId}
            className={classNames('relative', 'overflow-hidden', 'w-full', props.className)}
            data-sb-field-path=".hero"
        >
            {/* Full-width image on all devices */}
            {media?.url && (
                <div className="relative w-full" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
                    <img
                        src={media.url}
                        alt={media.altText || ''}
                        className="w-full object-cover"
                        style={{ maxHeight: '70vh' }}
                        data-sb-field-path=".media.url"
                    />
                </div>
            )}
        </section>
    );
}