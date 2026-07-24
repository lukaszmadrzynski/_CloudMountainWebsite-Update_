import * as React from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import { Action, Badge } from '../../atoms';
import { imageDims, srcSetFor } from '../../../utils/image-dims';

interface HeroSectionProps {
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

export default function HeroSection(props: HeroSectionProps) {
    const { elementId, badge, title, subtitle, text, actions = [], media, colors, backgroundImage, styles = {} } = props;

    const isDarkBg = colors?.includes('dark');
    const subtitleColorClass = isDarkBg ? 'text-white' : 'text-dark';

    // Desktop text shadows for overlay
    const intenseShadow = { textShadow: '3px 3px 12px rgba(0,0,0,1), -2px -2px 6px rgba(0,0,0,1)' };
    const mediumShadow = { textShadow: '0 0 15px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,1)' };
    const buttonShadow = { filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.9))' };

    return (
        <section
            id={elementId}
            className={classNames('relative', 'overflow-hidden', 'min-h-0', 'lg:min-h-screen', props.className)}
            data-sb-field-path=".hero"
        >
            {/* LCP preload. The hero image is the Largest Contentful Paint
                candidate for most pages. Preload tells the browser to start
                fetching it before the <img> tag is even parsed, which
                typically saves 200-500ms of LCP time. We preload with
                imagesrcset so the browser can pick the right variant for
                the viewport � on a 414px mobile, this is the ~40 KB
                -sm.webp instead of the ~360 KB original. fetchpriority="high"
                on the <img> below reinforces this. */}
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
            {/* Hero image (LCP candidate).
                Previously rendered as TWO <img> tags (mobile + desktop) with
                the same src � browsers fetched both copies even though only
                one was visible per viewport, doubling bandwidth and hurting
                LCP. Now a single <img> tag, with CSS controlling layout:
                  - mobile/tablet: normal flow, full width, auto height
                  - lg and up: absolutely positioned, covers the section
                This gives us one fetch, one image, both layouts.

                Responsive srcset: we ship three variants (sm/md/lg) per
                hero. The browser picks the smallest one that matches the
                viewport via the `sizes` attribute. On a 414px mobile, this
                is typically 30-90 KB instead of 200-700 KB.

                width/height come from the build-time image-dims manifest
                so CLS=0 for any aspect ratio (16:9, 3:2, 2.66:1, etc.).
                Falls back to 1920x1080 if the manifest doesn't have the
                URL � still gets a width/height, just may not match. `block`
                removes the inline-baseline gap some browsers add. */}
            {media?.url && (
                <>
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
                                className="block w-full h-auto lg:absolute lg:inset-0 lg:h-full lg:w-full lg:object-cover"
                                data-sb-field-path=".media.url"
                            />
                        );
                    })()}
                    {/* Mobile-only gradient overlay (sits over the image, but
                        only on small viewports where content is below image) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent lg:hidden" />
                </>
            )}

            {/* Mobile & Tablet: Content section (below image on solid background) - CENTER ALIGNED */}
            <div className="lg:hidden relative z-10 w-full bg-neutral-50 dark:bg-neutral-900">
                <div className="px-5 py-3 text-center">
                    {badge && (
                        <div className="mb-2" data-sb-field-path=".badge">
                            <Badge {...badge} />
                        </div>
                    )}

                    {title && (
                        <h1 className="h1 text-neutral-900 dark:text-white mb-3 px-2 text-4xl sm:text-5xl md:text-5xl"
                            style={{ color: '#434343' }}
                            dangerouslySetInnerHTML={{ __html: title.text }}
                            data-sb-field-path=".title.text">
                        </h1>
                    )}

                    {subtitle && (
                        <p className="text-base sm:text-lg mb-3 max-w-3xl mx-auto leading-relaxed text-neutral-700 dark:text-neutral-300"
                            dangerouslySetInnerHTML={{ __html: subtitle }}
                            data-sb-field-path=".subtitle">
                        </p>
                    )}

                    {text && (
                        <p className="text-sm sm:text-base mb-5 max-w-2xl mx-auto leading-relaxed text-justify text-neutral-600 dark:text-neutral-400"
                            dangerouslySetInnerHTML={{ __html: text }}
                            data-sb-field-path=".text">
                        </p>
                    )}

                    {actions.length > 0 && (
                        <div className="flex flex-col items-center" data-sb-field-path=".actions">
                            {actions.map((action, index) => (
                                <Action key={index} {...action} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop: Content overlay (on background image) */}
            <div className="hidden lg:flex absolute inset-y-0 z-10 max-w-lg bg-black/40 backdrop-blur-sm">
                <div className="flex flex-col justify-center px-10 py-20 text-left w-full h-full">
                    {badge && (
                        <div className="mb-4" style={mediumShadow} data-sb-field-path=".badge">
                            <Badge {...badge} />
                        </div>
                    )}

                    {title && (
                        <h2 className={classNames("text-4xl xl:text-5xl font-bold mb-4 leading-tight text-white")} style={intenseShadow} dangerouslySetInnerHTML={{ __html: title.text }} data-sb-field-path=".title.text">
                        </h2>
                    )}

                    {subtitle && (
                        <p className={classNames("text-xl xl:text-2xl mb-6 max-w-xl leading-relaxed", subtitleColorClass)} style={intenseShadow} dangerouslySetInnerHTML={{ __html: subtitle }} data-sb-field-path=".subtitle">
                        </p>
                    )}

                    {text && (
                        <p className={classNames("text-lg xl:text-xl mb-8 max-w-xl leading-relaxed text-justify", subtitleColorClass)} style={intenseShadow} dangerouslySetInnerHTML={{ __html: text }} data-sb-field-path=".text">
                        </p>
                    )}

                    {actions.length > 0 && (
                        <div className="flex flex-col items-center" data-sb-field-path=".actions">
                            <div style={buttonShadow}>
                                {actions.map((action, index) => (
                                    <Action key={index} {...action} />
                                ))}
                            </div>

                            <div className="mt-8 flex flex-col items-center">
                                <span className={classNames("text-sm font-semibold mb-2", subtitleColorClass)} style={mediumShadow}>
                                    See Details
                                </span>
                                <svg
                                    className={classNames("w-6 h-6", subtitleColorClass)}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
