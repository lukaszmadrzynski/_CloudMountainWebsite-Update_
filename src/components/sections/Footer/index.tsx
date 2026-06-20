import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import classNames from 'classnames';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { Social, Action, Link } from '../../atoms';

export default function Footer(props) {
    const {
        colors = 'bg-light-fg-dark',
        logo,
        title,
        text,
        primaryLinks,
        secondaryLinks,
        socialLinks = [],
        legalLinks = [],
        copyrightText,
        styles = {},
        enableAnnotations
    } = props;
    return (
        <footer
            className={classNames(
                'sb-component',
                'sb-component-footer',
                colors,
                styles?.self?.margin ? mapStyles({ padding: styles?.self?.margin }) : undefined,
                styles?.self?.padding ? mapStyles({ padding: styles?.self?.padding }) : 'px-4 py-12'
            )}
            {...(enableAnnotations && { 'data-sb-object-id': props?.__metadata?.id })}
        >
            <div className="mx-auto max-w-7xl">
                {/* Centered logo section */}
                <div className="flex flex-col items-center mb-8">
                    {(logo?.url || title) && (
                        <Link href="/" className="flex flex-col items-center">
                            {logo && (
                                // Plain <img> instead of ImageBlock: ImageBlock
                                // reserves aspect-ratio space (16:9 default) to
                                // prevent CLS, which would render the logo at the
                                // wrapper's full width × 16:9 — far too large.
                                //
                                // Both the wrapper AND the img have explicit
                                // h-36 w-36 (144×144) so the rendered size is
                                // locked in. With object-contain, the 300×300
                                // source image is letterboxed inside the 144×144
                                // box (1:1 aspect matches the source, so no
                                // letterboxing in practice). Eager load so the
                                // image appears immediately on short pages where
                                // the footer is above the fold.
                                <div className="h-36 w-36 flex items-center justify-center">
                                    <img
                                        src={logo.url}
                                        alt={logo.altText || ''}
                                        width={144}
                                        height={144}
                                        className="h-36 w-36 object-contain"
                                        loading="eager"
                                        decoding="async"
                                        {...(enableAnnotations && { 'data-sb-field-path': 'logo' })}
                                    />
                                </div>
                            )}
                            {title && (
                                <div className="h4" {...(enableAnnotations && { 'data-sb-field-path': 'title' })}>
                                    {title}
                                </div>
                            )}
                        </Link>
                    )}
                </div>
                
                {/* Centered navigation links */}
                {primaryLinks && primaryLinks.links && primaryLinks.links.length > 0 && (
                    <div className="flex justify-center mb-8">
                        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 max-w-2xl">
                            {primaryLinks.links.map((link, index) => (
                                <li key={index}>
                                    <Action {...link} className="text-sm whitespace-nowrap" {...(enableAnnotations && { 'data-sb-field-path': `primaryLinks.${index}` })} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* Centered social links */}
                {socialLinks.length > 0 && (
                    <div className="flex justify-center mb-6">
                        <ul className="flex items-center gap-x-8" {...(enableAnnotations && { 'data-sb-field-path': 'socialLinks' })}>
                            {socialLinks.map((link, index) => (
                                <li key={index} className="text-2xl">
                                    <Social {...link} {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* Centered copyright */}
                {text && (
                    <div className="text-center mb-6">
                        <Markdown
                            options={{ forceInline: true, forceWrapper: true, wrapper: 'p' }}
                            className="text-sm"
                            {...(enableAnnotations && { 'data-sb-field-path': 'text' })}
                        >
                            {text}
                        </Markdown>
                    </div>
                )}
                
                {/* Copyright bar */}
                {(copyrightText || legalLinks.length > 0) && (
                    <div className="border-t border-white/20 pt-4 flex flex-col sm:flex-row sm:justify-center sm:items-center sm:gap-4 text-center">
                        {legalLinks.length > 0 && (
                            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-2 sm:mb-0" {...(enableAnnotations && { 'data-sb-field-path': 'legalLinks' })}>
                                {legalLinks.map((link, index) => (
                                    <li key={index}>
                                        <Action {...link} className="text-xs" {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })} />
                                    </li>
                                ))}
                            </ul>
                        )}
                        {copyrightText && (
                            <span className="text-xs" {...(enableAnnotations && { 'data-sb-field-path': 'copyrightText' })}>
                                {copyrightText}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </footer>
    );
}

function FooterLinksGroup(props) {
    const { title, links = [] } = props;
    const fieldPath = props['data-sb-field-path'];
    if (links.length === 0) {
        return null;
    }
    return (
        <div className="pb-8" data-sb-field-path={fieldPath}>
            {title && (
                <h2 className="uppercase text-base tracking-wide" {...(fieldPath && { 'data-sb-field-path': '.title' })}>
                    {title}
                </h2>
            )}
            {links.length > 0 && (
                <ul className={classNames('space-y-3 last:space-y-0', { 'mt-7': title })} {...(fieldPath && { 'data-sb-field-path': '.links' })}>
                    {links.map((link, index) => (
                        <li key={index}>
                            <Action {...link} className="text-sm" {...(fieldPath && { 'data-sb-field-path': `.${index}` })} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
