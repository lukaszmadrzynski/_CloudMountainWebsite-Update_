import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { Link, Action } from '../../atoms';
import ImageBlock from '../../blocks/ImageBlock';
import ChevronDownIcon from '../../svgs/chevron-down';
import CloseIcon from '../../svgs/close';
import MenuIcon from '../../svgs/menu';

export default function Header(props) {
    const { colors = 'bg-light-fg-dark', styles = {}, enableAnnotations } = props;
    return (
        <header
            className={classNames(
                'sb-component',
                'sb-component-header',
                colors,
                'fixed top-0 left-0 right-0 z-50',
                'shadow-md',
                styles?.self?.margin ? mapStyles({ padding: styles?.self?.margin }) : undefined,
                styles?.self?.padding ? mapStyles({ padding: styles?.self?.padding }) : 'p-4'
            )}
            {...(enableAnnotations && { 'data-sb-object-id': props?.__metadata?.id })}
        >
            <div className="max-w-7xl mx-auto">
                <Link href="#main" className="sr-only">
                    Skip to main content
                </Link>
                <HeaderVariants {...props} />
            </div>
        </header>
    );
}

function HeaderVariants(props) {
    const { variant = 'logo-left-primary-nav-left', ...rest } = props;
    switch (variant) {
        case 'logo-left-primary-nav-centered':
            return <HeaderLogoLeftPrimaryCentered {...rest} />;
        case 'logo-left-primary-nav-right':
            return <HeaderLogoLeftPrimaryRight {...rest} />;
        case 'logo-centered-primary-nav-left':
            return <HeaderLogoCenteredPrimaryLeft {...rest} />;
        case 'logo-centered-primary-nav-centered':
            return <HeaderLogoCenteredPrimaryCentered {...rest} />;
        default:
            return <HeaderLogoLeftPrimaryLeft {...rest} />;
    }
}

function HeaderLogoLeftPrimaryLeft(props) {
    const { title, logo, primaryLinks = [], secondaryLinks = [], colors = 'bg-light-fg-dark', enableAnnotations } = props;
    return (
        <div className="flex items-center relative">
            {(title || logo?.url) && (
                <div className="mr-10">
                    <SiteLogoLink title={title} logo={logo} enableAnnotations={enableAnnotations} />
                </div>
            )}
            {primaryLinks.length > 0 && (
                <ul className="hidden mr-10 gap-x-10 lg:flex lg:items-center" {...(enableAnnotations && { 'data-sb-field-path': 'primaryLinks' })}>
                    <ListOfLinks links={primaryLinks} colors={colors} enableAnnotations={enableAnnotations} />
                </ul>
            )}
            {secondaryLinks.length > 0 && (
                <ul className="hidden ml-auto gap-x-2.5 lg:flex lg:items-center" {...(enableAnnotations && { 'data-sb-field-path': 'secondaryLinks' })}>
                    <ListOfLinks links={secondaryLinks} enableAnnotations={enableAnnotations} />
                </ul>
            )}
            {(primaryLinks.length > 0 || secondaryLinks.length > 0) && <MobileMenu {...props} />}
        </div>
    );
}

function HeaderLogoLeftPrimaryCentered(props) {
    const { title, logo, primaryLinks = [], secondaryLinks = [], colors = 'bg-light-fg-dark', enableAnnotations } = props;
    return (
        <div className="flex items-center relative">
            {(title || logo?.url) && (
                <div className="mr-10">
                    <SiteLogoLink title={title} logo={logo} enableAnnotations={enableAnnotations} />
                </div>
            )}
            {primaryLinks.length > 0 && (
                <ul
                    className="hidden lg:flex lg:items-center gap-x-10 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-auto"
                    {...(enableAnnotations && { 'data-sb-field-path': 'primaryLinks' })}
                >
                    <ListOfLinks links={primaryLinks} colors={colors} enableAnnotations={enableAnnotations} />
                </ul>
            )}
            {secondaryLinks.length > 0 && (
                <ul className="hidden lg:flex lg:items-center ml-auto gap-x-2.5" {...(enableAnnotations && { 'data-sb-field-path': 'secondaryLinks' })}>
                    <ListOfLinks links={secondaryLinks} enableAnnotations={enableAnnotations} />
                </ul>
            )}
            {(primaryLinks.length > 0 || secondaryLinks.length > 0) && <MobileMenu {...props} />}
        </div>
    );
}

function HeaderLogoLeftPrimaryRight(props) {
    const { title, logo, primaryLinks = [], secondaryLinks = [], colors = 'bg-light-fg-dark', enableAnnotations } = props;
    return (
        <div className="flex items-center relative">
            {(title || logo?.url) && (
                <div className="mr-10">
                    <SiteLogoLink title={title} logo={logo} enableAnnotations={enableAnnotations} />
                </div>
            )}
            {primaryLinks.length > 0 && (
                <ul className="hidden lg:flex lg:items-center ml-auto gap-x-10" {...(enableAnnotations && { 'data-sb-field-path': 'primaryLinks' })}>
                    <ListOfLinks links={primaryLinks} colors={colors} enableAnnotations={enableAnnotations} />
                </ul>
            )}
            {secondaryLinks.length > 0 && (
                <ul
                    className={classNames('hidden', 'lg:flex', 'lg:items-center', 'gap-x-2.5', primaryLinks.length > 0 ? 'ml-10' : 'ml-auto')}
                    {...(enableAnnotations && { 'data-sb-field-path': 'secondaryLinks' })}
                >
                    <ListOfLinks links={secondaryLinks} enableAnnotations={enableAnnotations} />
                </ul>
            )}
            {(primaryLinks.length > 0 || secondaryLinks.length > 0) && <MobileMenu {...props} />}
        </div>
    );
}

function HeaderLogoCenteredPrimaryLeft(props) {
    const { title, logo, primaryLinks = [], secondaryLinks = [], colors = 'bg-light-fg-dark', enableAnnotations } = props;
    return (
        <div className="flex items-center relative">
            {(title || logo?.url) && (
                <div className="mr-10 lg:mr-0 lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2">
                    <SiteLogoLink title={title} logo={logo} enableAnnotations={enableAnnotations} />
                </div>
            )}
            {primaryLinks.length > 0 && (
                <ul className="hidden lg:flex lg:items-center gap-x-10" {...(enableAnnotations && { 'data-sb-field-path': 'primaryLinks' })}>
                    <ListOfLinks links={primaryLinks} colors={colors} enableAnnotations={enableAnnotations} />
                </ul>
            )}
            {secondaryLinks.length > 0 && (
                <ul className="hidden lg:flex lg:items-center ml-auto gap-x-2.5" {...(enableAnnotations && { 'data-sb-field-path': 'secondaryLinks' })}>
                    <ListOfLinks links={secondaryLinks} enableAnnotations={enableAnnotations} />
                </ul>
            )}
            {(primaryLinks.length > 0 || secondaryLinks.length > 0) && <MobileMenu {...props} />}
        </div>
    );
}

function HeaderLogoCenteredPrimaryCentered(props) {
    const { title, logo, primaryLinks = [], secondaryLinks = [], colors = 'bg-light-fg-dark', enableAnnotations } = props;
    return (
        <>
            <div className="flex items-center relative">
                {(title || logo?.url) && (
                    <div className="mr-10 lg:mr-0 lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2">
                        <SiteLogoLink title={title} logo={logo} enableAnnotations={enableAnnotations} />
                    </div>
                )}
                {secondaryLinks.length > 0 && (
                    <ul className="hidden lg:flex lg:items-center gap-x-2.5 ml-auto" {...(enableAnnotations && { 'data-sb-field-path': 'secondaryLinks' })}>
                        <ListOfLinks links={secondaryLinks} enableAnnotations={enableAnnotations} />
                    </ul>
                )}
                {(primaryLinks.length > 0 || secondaryLinks.length > 0) && <MobileMenu {...props} />}
            </div>
            {primaryLinks.length > 0 && (
                <ul
                    className="hidden lg:flex lg:items-center lg:justify-center gap-x-10 mt-4"
                    {...(enableAnnotations && { 'data-sb-field-path': 'primaryLinks' })}
                >
                    <ListOfLinks links={primaryLinks} colors={colors} enableAnnotations={enableAnnotations} />
                </ul>
            )}
        </>
    );
}

function MobileMenu(props) {
    const { title, logo, primaryLinks = [], secondaryLinks = [], colors = 'bg-light-fg-dark', styles = {}, enableAnnotations } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(64);
    const [bookingBarHeight, setBookingBarHeight] = useState(0);
    const router = useRouter();

    const openMobileMenu = () => {
        setIsMenuOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'unset';
    };

    useEffect(() => {
        const handleRouteChange = () => {
            setIsMenuOpen(false);
            document.body.style.overflow = 'unset';
        };
        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router.events]);

    // Measure the header (so the menu can sit directly below it) and the
    // mobile/tablet StickyBookingBar so the menu can end exactly at the
    // bottom of the Book Now button. The bar is `fixed` at
    // `top: ${headerHeight}px` and ~60px tall, so the bottom of the bar
    // is at `headerHeight + barHeight` from the top of the viewport, or
    // `windowHeight - headerHeight - barHeight` from the bottom. We use
    // the bottom-anchored value for `bottom:` so the menu's lower edge
    // aligns with the bar's lower edge.
    useEffect(() => {
        if (!isMenuOpen) return;

        const measure = () => {
            // On desktop, no mobile menu / booking bar to worry about.
            const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
            if (isDesktop) {
                setHeaderHeight(0);
                setBookingBarHeight(0);
                return;
            }
            const header = document.querySelector('header');
            if (header) {
                setHeaderHeight(header.getBoundingClientRect().height);
            }
            // StickyBookingBar renders three variants (desktop, mobile,
            // tablet). The mobile/tablet one is `display:none` on desktop,
            // and the desktop one is `display:none` on mobile/tablet, so
            // pick the one with non-zero offsetHeight (offsetHeight is 0
            // for display:none elements and unaffected by transforms).
            const bars = document.querySelectorAll('.sb-component-sticky-booking-bar');
            let barHeight = 0;
            for (const bar of bars) {
                if (bar.offsetHeight > 0) {
                    barHeight = bar.offsetHeight;
                    break;
                }
            }
            // Fallback to a reasonable default (~60px) if nothing is found.
            if (barHeight === 0) barHeight = 60;
            // The bar sits at `top: ${headerHeight}px`, so its bottom edge
            // is at headerHeight + barHeight from the top. Convert to the
            // distance from the screen bottom for the menu's `bottom` style.
            const h = header ? header.getBoundingClientRect().height : 64;
            setBookingBarHeight(h + barHeight);
        };

        measure();
        window.addEventListener('resize', measure);
        const t1 = setTimeout(measure, 50);
        const t2 = setTimeout(measure, 300);

        return () => {
            window.removeEventListener('resize', measure);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [isMenuOpen]);

    return (
        <div className="ml-auto lg:hidden">
            <button aria-label={isMenuOpen ? "Close Menu" : "Open Menu"} title={isMenuOpen ? "Close Menu" : "Open Menu"} className="relative z-50 p-2 -mr-1 focus:outline-none" onClick={isMenuOpen ? closeMobileMenu : openMobileMenu}>
                <span className="sr-only">{isMenuOpen ? "Close Menu" : "Open Menu"}</span>
                {isMenuOpen ? <CloseIcon className="fill-current h-6 w-6" /> : <MenuIcon className="fill-current h-6 w-6" />}
            </button>
            <div
                className={classNames('bg-white/60', 'backdrop-blur-lg', 'fixed', 'left-0', 'right-0', 'overflow-y-auto', 'z-10', isMenuOpen ? 'block' : 'hidden')}
                style={{ top: `${headerHeight}px`, maxHeight: `calc(100vh - ${headerHeight}px - ${bookingBarHeight}px)` }}
            >
                <div className="flex flex-col">
                    {primaryLinks.length > 0 && (
                        <ul className="px-4" {...(enableAnnotations && { 'data-sb-field-path': 'primaryLinks' })}>
                            <ListOfLinks links={primaryLinks} enableAnnotations={enableAnnotations} inMobileMenu />
                        </ul>
                    )}
                    {secondaryLinks.length > 0 && (
                        <ul className="px-4" {...(enableAnnotations && { 'data-sb-field-path': 'secondaryLinks' })}>
                            <ListOfLinks links={secondaryLinks} enableAnnotations={enableAnnotations} inMobileMenu />
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

function SiteLogoLink({ title, logo, enableAnnotations }) {
    return (
        <Link href="/" className="flex items-center">
            {logo && <ImageBlock {...logo} {...(enableAnnotations && { 'data-sb-field-path': 'logo' })} />}
            {title && (
                <span className="h4" {...(enableAnnotations && { 'data-sb-field-path': 'title' })}>
                    {title}
                </span>
            )}
        </Link>
    );
}

function ListOfLinks(props) {
    const { links = [], colors, enableAnnotations, inMobileMenu = false } = props;

    return (
        <>
            {links.map((link, index) => {
                if (link.__metadata.modelName === 'SubNav') {
                    return (
                        <LinkWithSubnav
                            key={index}
                            link={link}
                            inMobileMenu={inMobileMenu}
                            colors={colors}
                            {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })}
                        />
                    );
                } else {
                    return (
                        <li
                            key={index}
                            className={classNames(inMobileMenu ? 'border-t' : 'py-2', {
                                'py-4': inMobileMenu && link.__metadata.modelName === 'Button'
                            })}
                        >
                            <Action
                                {...link}
                                className={classNames('whitespace-nowrap', inMobileMenu ? 'w-full' : 'text-base', {
                                    'justify-start py-3': inMobileMenu && link.__metadata.modelName === 'Link'
                                })}
                                {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })}
                            />
                        </li>
                    );
                }
            })}
        </>
    );
}

function LinkWithSubnav(props) {
    const { link, colors, inMobileMenu = false } = props;
    const [isSubNavOpen, setIsSubNavOpen] = useState(false);
    const router = useRouter();
    const fieldPath = props['data-sb-field-path'];

    useEffect(() => {
        const handleRouteChange = () => {
            setIsSubNavOpen(false);
            document.body.style.overflow = 'unset';
        };
        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router.events]);

    return (
        <li
            className={classNames('relative', inMobileMenu ? 'border-t py-3' : 'py-2 group')}
            onMouseLeave={
                !process.env.stackbitPreview && !inMobileMenu
                    ? () => {
                          setIsSubNavOpen(false);
                      }
                    : undefined
            }
            data-sb-field-path={fieldPath}
        >
            <button
                aria-expanded={isSubNavOpen ? 'true' : 'false'}
                onMouseOver={
                    !process.env.stackbitPreview && !inMobileMenu
                        ? () => {
                              setIsSubNavOpen(true);
                          }
                        : undefined
                }
                onClick={() => setIsSubNavOpen((prev) => !prev)}
                className={classNames(
                    'sb-component',
                    'sb-component-block',
                    'sb-component-link',
                    link.labelStyle === 'secondary' ? 'sb-component-link-secondary' : 'sb-component-link-primary',
                    'inline-flex',
                    'items-center',
                    inMobileMenu ? 'w-full' : 'text-base',
                    {
                        'group-hover:no-underline hover:no-underline': !inMobileMenu && (link.labelStyle ?? 'primary') === 'primary',
                        'group-hover:text-primary': !inMobileMenu && link.labelStyle === 'secondary'
                    }
                )}
            >
                <span {...(fieldPath && { 'data-sb-field-path': '.label' })}>{link.label}</span>
                <ChevronDownIcon
                    className={classNames('fill-current', 'shrink-0', 'h-4', 'w-4', isSubNavOpen && 'rotate-180', inMobileMenu ? 'ml-auto' : 'ml-1')}
                />
            </button>
            {(link.links ?? []).length > 0 && (
                <ul
                    className={classNames(
                        colors,
                        inMobileMenu ? 'p-4 space-y-3' : 'absolute top-full left-0 w-44 border-t border-primary shadow-md z-10 px-6 pt-5 pb-6 space-y-4',
                        isSubNavOpen ? 'block' : 'hidden'
                    )}
                    {...(fieldPath && { 'data-sb-field-path': '.links' })}
                >
                    <ListOfSubNavLinks links={link.links} hasAnnotations={!!fieldPath} inMobileMenu={inMobileMenu} />
                </ul>
            )}
        </li>
    );
}

function ListOfSubNavLinks({ links = [], hasAnnotations, inMobileMenu = false }) {
    return (
        <>
            {links.map((link, index) => (
                <li key={index}>
                    <Action
                        {...link}
                        className={classNames(inMobileMenu ? 'w-full justify-start' : 'text-base')}
                        {...(hasAnnotations && { 'data-sb-field-path': `.${index}` })}
                    />
                </li>
            ))}
        </>
    );
}
