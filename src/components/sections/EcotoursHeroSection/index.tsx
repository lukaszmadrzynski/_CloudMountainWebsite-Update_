import * as React from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import { imageDims, srcSetFor } from '../../../utils/image-dims';

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
            {/* LCP preload. The ecotours-listing hero is the LCP for /ecotours.
                imagesrcset lets the browser pick the right variant. */}
            {media?.url && (() => {
                const baseUrl = media.url;
                const srcset = srcSetFor(baseUrl);
                return (
                    <Head>
                        <link
                            rel="preload"
                            as="image"
                            href={baseUrl}
                            {...(srcset && { imagesrcset: srcset, imagesizes: '100vw' })}
                            fetchPriority="high"
                        />
                    </Head>
                );
            })()}
            {/* Full-width image container - mobile taller than desktop.
                Responsive srcset: 640w/1024w/1920w variants. width/height
                come from the build-time manifest (e.g. ecotours-listing is
                1980x744, contact-us is 1980x615, why-us is 1980x569) so
                CLS=0 regardless of aspect ratio. */}
            {media?.url && (
                <div
                    className="relative w-full"
                    style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
                >
                    {(() => {
                        const baseUrl = media.url;
                        const srcset = srcSetFor(baseUrl);
                        const { width, height } = imageDims(baseUrl);
                        return (
                            <img
                                src={baseUrl}
                                srcSet={srcset}
                                sizes="100vw"
                                alt={media.altText || ''}
                                width={width}
                                height={height}
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                                className="w-full object-cover EcotoursHeroSection-img"
                                data-sb-field-path=".media.url"
                            />
                        );
                    })()}
                </div>
            )}
        </section>
    );
}