import * as React from 'react';
import classNames from 'classnames';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { imageDims } from '../../../utils/image-dims';

export default function ImageBlock(props) {
    const { elementId, className, imageClassName, url, altText = '', width, height, aspectRatio, styles = {} } = props;
    if (!url) {
        return null;
    }
    const fieldPath = props['data-sb-field-path'];
    const annotations = fieldPath
        ? { 'data-sb-field-path': [fieldPath, `${fieldPath}.url#@src`, `${fieldPath}.altText#@alt`, `${fieldPath}.elementId#@id`].join(' ').trim() }
        : {};

    // The wrapper reserves space for the image to prevent Cumulative Layout
    // Shift (CLS). Three sources of width/height, in priority order:
    //   1. Explicit props.width/height (caller knows the dimensions)
    //   2. Build-time manifest lookup (image-dims.json) — every image in
    //      public/images/* is registered, so any image on the site can
    //      reserve its actual aspect ratio without per-caller config
    //   3. aspectRatio prop, or 16/9 default as a last resort
    // The manifest lookup is the big CLS win: it means GenericSection,
    // EcotourCard, FeaturedItem, and any other caller that uses
    // ImageBlock with no explicit dims still gets accurate aspect-ratio
    // reservation. Previously, the 16/9 default would crop non-16:9
    // images (e.g. ecotours-listing/expeditions-banner.webp is 1.59:1)
    // and the wrapper's mismatch with the image's natural ratio would
    // cause subtle reflows when the image streamed in.
    const manifestDims = imageDims(url);
    const effectiveWidth = width ?? manifestDims.width;
    const effectiveHeight = height ?? manifestDims.height;
    const hasExplicitDims = !!(effectiveWidth && effectiveHeight);
    const wrapperStyle = hasExplicitDims
        ? { aspectRatio: `${effectiveWidth} / ${effectiveHeight}` }
        : { aspectRatio: aspectRatio || '16 / 9' };

    return (
        <div
            className={classNames(
                'sb-component',
                'sb-component-block',
                'sb-component-image-block',
                className,
                styles?.self?.margin ? mapStyles({ margin: styles?.self?.margin }) : undefined
            )}
            style={wrapperStyle}
            {...annotations}
        >
            <img
                id={elementId}
                className={classNames(
                    'w-full',
                    'h-full',
                    'object-cover',
                    imageClassName,
                    styles?.self?.padding ? mapStyles({ padding: styles?.self?.padding }) : undefined,
                    styles?.self?.borderWidth && styles?.self?.borderWidth !== 0 && styles?.self?.borderStyle !== 'none'
                        ? mapStyles({
                              borderWidth: styles?.self?.borderWidth,
                              borderStyle: styles?.self?.borderStyle,
                              borderColor: styles?.self?.borderColor ?? 'border-primary'
                          })
                        : undefined,
                    styles?.self?.borderRadius ? mapStyles({ borderRadius: styles?.self?.borderRadius }) : undefined
                )}
                src={url}
                alt={altText}
                width={effectiveWidth}
                height={effectiveHeight}
                loading={hasExplicitDims ? 'eager' : 'lazy'}
                decoding="async"
            />
        </div>
    );
}
