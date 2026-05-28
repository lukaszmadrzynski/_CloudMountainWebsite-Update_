import * as React from 'react';
import classNames from 'classnames';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';

export default function TitleBlock(props) {
    const { className, text = [], color = 'text-dark', styles = {} } = props;
    const fieldPath = props['data-sb-field-path'];
    if (!text) {
        return null;
    }

    return (
        <h2
            className={classNames(
                'sb-component',
                'sb-component-block',
                'sb-component-title',
                'text-2xl sm:text-3xl',
                color,
                className,
                styles?.self ? mapStyles(styles?.self) : undefined,
                'text-center'
            )}
            data-sb-field-path={fieldPath}
        >
            <span {...(fieldPath && { 'data-sb-field-path': '.text' })} dangerouslySetInnerHTML={{ __html: text }} />
        </h2>
    );
}
