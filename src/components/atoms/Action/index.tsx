import * as React from 'react';
import classNames from 'classnames';
import { iconMap } from '../../svgs';
import Link from '../Link';
import Calendar from '../../svgs/calendar';

export default function Action(props) {
    const { elementId, className, label, altText, url, showIcon, icon, iconPosition = 'right', style = 'secondary' } = props;
    const IconComponent = icon ? iconMap[icon] : null;
    const fieldPath = props['data-sb-field-path'];
    const annotations = fieldPath
        ? { 'data-sb-field-path': [fieldPath, `${fieldPath}.url#@href`, `${fieldPath}.altText#@aria-label`, `${fieldPath}.elementId#@id`].join(' ').trim() }
        : {};
    const type = props.__metadata?.modelName;
    
    // Auto-detect booking buttons and use primary style
    const isBookingButton = url && url.includes('/book');
    const effectiveStyle = isBookingButton ? 'primary' : style;
    const showCalendarIcon = isBookingButton && showIcon !== false;
    
    return (
        <Link
            href={url}
            aria-label={altText}
            id={elementId}
            className={classNames(
                'sb-component',
                'sb-component-block',
                'text-center',
                type === 'Button' ? 'sb-component-button' : 'sb-component-link',
                {
                    'sb-component-button-primary': type === 'Button' && effectiveStyle === 'primary',
                    'sb-component-button-secondary': type === 'Button' && effectiveStyle === 'secondary',
                    'sb-component-button-outline': type === 'Button' && effectiveStyle === 'outline',
                    'sb-component-link-primary': type === 'Link' && effectiveStyle === 'primary',
                    'sb-component-link-secondary': type === 'Link' && effectiveStyle === 'secondary',
                    'sb-component-link-outline': type === 'Link' && effectiveStyle === 'outline'
                },
                className
            )}
            {...annotations}
        >
            {showCalendarIcon && (
                <Calendar
                    className="shrink-0 w-[1.25em] h-[1.25em] mr-[0.5em]"
                />
            )}
            {label && <span {...(fieldPath && { 'data-sb-field-path': '.label' })}>{label}</span>}
            {showIcon && !isBookingButton && IconComponent && (
                <IconComponent
                    className={classNames('shrink-0', 'w-[1.25em]', 'h-[1.25em]', {
                        'order-first': iconPosition === 'left',
                        'mr-[0.5em]': label && iconPosition === 'left',
                        'ml-[0.5em]': label && iconPosition === 'right'
                    })}
                    {...(fieldPath && { 'data-sb-field-path': '.icon' })}
                />
            )}
        </Link>
    );
}
