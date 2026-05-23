import * as React from 'react';
import classNames from 'classnames';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';

export default function Badge(props) {
    const { label, color = 'text-primary', styles, className } = props;
    const fieldPath = props['data-sb-field-path'];
    if (!label) {
        return null;
    }

    return (
        <div
            className={classNames(
                'sb-component',
                'sb-component-block',
                'sb-component-badge',
                styles?.self ? mapStyles(styles?.self) : undefined,
                color,
                className
            )}
            data-sb-field-path={fieldPath}
        >
            <span className="uppercase tracking-wider font-bold text-sm md:text-base" {...(fieldPath && { 'data-sb-field-path': '.label' })}>
                {label}
            </span>
        </div>
    );
}
