import * as React from 'react';
import classNames from 'classnames';

import { getDataAttrs } from '../../../utils/get-data-attrs';
import Section from '../Section';

export default function DividerSection(props) {
    const { elementId, colors, styles = {}, hideOnDesktop = false } = props;

    return (
        <Section 
            elementId={elementId} 
            className="sb-component-divider-section" 
            colors={colors} 
            styles={styles?.self} 
            {...getDataAttrs(props)}
        >
            <div className={classNames('w-full pt-2 px-4', { 'lg:hidden': hideOnDesktop })}>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
        </Section>
    );
}