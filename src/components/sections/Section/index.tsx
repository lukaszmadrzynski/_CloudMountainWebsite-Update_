import * as React from 'react';
import classNames from 'classnames';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { getDataAttrs } from '../../../utils/get-data-attrs';
import BackgroundImage from '../../atoms/BackgroundImage';

export default function Section(props) {
    const { elementId, className, colors = 'bg-light-fg-dark', backgroundImage, styles = {}, children, fullWidth = false } = props;

    return (
            <div
            id={elementId}
            className={classNames(
                'sb-component',
                'sb-component-section',
                className,
                colors,
                'relative',
                styles?.margin ? mapStyles({ margin: styles?.margin }) : undefined,
                styles?.padding ? mapStyles({ padding: styles?.padding }) : undefined
            )}
            {...getDataAttrs(props)}
        >
            {backgroundImage && <BackgroundImage {...backgroundImage} className="absolute inset-0" />}
            <div className={classNames('w-full', fullWidth ? 'max-w-full' : 'max-w-5xl', 'mx-auto', 'relative')}>{children}</div>
        </div>
    );
}