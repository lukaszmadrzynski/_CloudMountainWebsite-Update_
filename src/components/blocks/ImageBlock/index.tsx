import * as React from 'react';
import classNames from 'classnames';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';

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
    // Shift (CLS). When the caller passes explicit width/height we use them
    // as the wrapper's aspect-ratio so the browser reserves exactly that
    // shape. Otherwise we fall back to the configured aspectRatio (or 16/9)
    // so the image has SOME reserved space rather than collapsing the
    // layout. Note: this makes small/portrait images like logos render at
    // the wrapper's aspect ratio, which is usually too large. Callers that
    // want natural sizing (e.g. the footer logo) should NOT use this
    // component — render a plain <img> instead.
    const hasExplicitDims = !!(width && height);
    const wrapperStyle = hasExplicitDims
        ? { aspectRatio: `${width} / ${height}` }
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
                width={width}
                height={height}
                loading={hasExplicitDims ? 'eager' : 'lazy'}
                decoding="async"
            />
        </div>
    );
}
