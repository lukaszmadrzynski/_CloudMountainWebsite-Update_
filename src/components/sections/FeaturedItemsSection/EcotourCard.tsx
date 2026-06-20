import * as React from 'react';
import classNames from 'classnames';
import Markdown from 'markdown-to-jsx';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { imageDims } from '../../../utils/image-dims';
import Action from '../../atoms/Action';

export default function EcotourCard(props) {
    const { elementId, title, tagline, subtitle, text, image, actions = [], styles = {}, hasSectionTitle } = props;
    const fieldPath = props['data-sb-field-path'];
    const TitleTag = hasSectionTitle ? 'h3' : 'h2';
    
    const hasImage = !!(image?.url || image?.altText);

    // Look up image dimensions from the build-time manifest so the
    // browser reserves the correct aspect-ratio space BEFORE the image
    // loads. Without width/height attrs, the card has 0 height for the
    // image area and grows as the image streams in — that reflow shifts
    // the whole grid below the card (huge CLS). With width/height, the
    // browser computes the layout box from the intrinsic ratio.
    const imgDims = image?.url ? imageDims(image.url) : { width: 500, height: 300, found: false };

    // Get the first action URL for card linking
    const firstActionUrl = actions?.[0]?.url;

    // Card classes - Ecotour styling with primary color outline and hover effects
    const cardClasses = classNames(
        'sb-card',
        'bg-white',
        'text-dark',
        styles?.self?.margin ? mapStyles({ margin: styles?.self?.margin }) : undefined,
        styles?.self?.padding ? mapStyles({ padding: styles?.self?.padding }) : 'p-3',
        styles?.self?.borderRadius ? mapStyles({ borderRadius: styles?.self?.borderRadius }) : 'rounded-xl',
        styles?.self?.textAlign ? mapStyles({ textAlign: styles?.self?.textAlign }) : undefined,
        'overflow-hidden',
        'relative',
        'transition-all',
        'duration-300',
        'hover:-translate-y-2',
        'hover:shadow-lg',
        'border-2',
        'border-primary',
        'h-full',
        'flex',
        'flex-col'
    );

    return (
        <div
            id={elementId}
            className={cardClasses}
            data-sb-field-path={fieldPath}
        >
            {/* Clickable overlay - renders link that covers entire card */}
            {firstActionUrl && (
                <a 
                    href={firstActionUrl} 
                    className="absolute inset-0 z-20" 
                    aria-label={title || 'View details'}
                />
            )}
            {/* Image on top */}
            {hasImage && image.url && (
                <div className="mb-4 flex-shrink-0 relative z-10 overflow-hidden rounded-lg">
                    <img
                        src={image.url}
                        alt={image.altText || ''}
                        width={imgDims.width}
                        height={imgDims.height}
                        className="w-full h-auto object-cover block"
                        style={{ maxWidth: '100%', display: 'block' }}
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            )}

            {/* Text content below */}
            <div className="flex flex-col flex-1 relative z-10">
                {tagline && (
                    <p className="text-xs text-primary font-medium" {...(fieldPath && { 'data-sb-field-path': '.tagline' })}>
                        {tagline}
                    </p>
                )}
                {title && (
                    <TitleTag
                        className={classNames('text-xl font-semibold', {
                            'mt-1': tagline
                        })}
                        {...(fieldPath && { 'data-sb-field-path': '.title' })}
                    >
                        {title}
                    </TitleTag>
                )}
                {subtitle && (
                    <p
                        className={classNames('text-sm', {
                            'mt-1': tagline || title
                        })}
                        {...(fieldPath && { 'data-sb-field-path': '.subtitle' })}
                    >
                        {subtitle}
                    </p>
                )}
                {text && (
                    <div
                        className={classNames('text-base text-neutral-600 mt-3', {
                            'mt-3': tagline || title || subtitle
                        })}
                        {...(fieldPath && { 'data-sb-field-path': '.text' })}
                    >
                        <Markdown>{text}</Markdown>
                    </div>
                )}
                {actions.length > 0 && firstActionUrl && (
                    <div
                        className="mt-4 w-full flex justify-center"
                        {...(fieldPath && { 'data-sb-field-path': '.actions' })}
                    >
                        {actions.map((action, actionIndex) => {
                            // Replace generic "Learn More" with a contextual label so
                            // search engines, screen readers, and users see distinct
                            // link text for each tour (avoids SEO "duplicate links" penalty
                            // and gives users a clear expectation of what each link leads to).
                            const isGenericLearnMore = !action.label || action.label.trim().toLowerCase() === 'learn more';
                            const contextualLabel = isGenericLearnMore && title
                                ? `View ${title}`
                                : action.label;
                            return (
                                <Action
                                    key={actionIndex}
                                    {...action}
                                    label={contextualLabel}
                                    className="text-sm"
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}