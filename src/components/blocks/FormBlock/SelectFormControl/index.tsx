import * as React from 'react';
import classNames from 'classnames';

import ChevronDownIcon from '../../../svgs/chevron-down';

export default function SelectFormControl(props) {
    const { name, label, hideLabel, isRequired, options = [], defaultValue, width = 'full' } = props;
    const fieldPath = props['data-sb-field-path'];
    const labelId = `${name}-label`;
    const [selectedValue, setSelectedValue] = React.useState(defaultValue || '');
    
    // Update selected value when defaultValue changes
    React.useEffect(() => {
        setSelectedValue(defaultValue || '');
    }, [defaultValue]);
    
    const attr: React.SelectHTMLAttributes<HTMLSelectElement> = {};
    if (label) {
        attr['aria-labelledby'] = labelId;
    }
    if (isRequired) {
        attr['required'] = true;
    }

    return (
        <div
            className={classNames('sb-form-control', 'w-full', {
                'sm:w-formField': width === '1/2'
            })}
            data-sb-field-path={fieldPath}
        >
            {label && (
                <label
                    id={labelId}
                    className={classNames('sb-label', 'inline-block', 'sm:mb-1.5', 'font-bold', { 'sr-only': hideLabel })}
                    htmlFor={name}
                    {...(fieldPath && { 'data-sb-field-path': '.label .name#@for' })}
                >
                    {label}
                    {isRequired && <span className="text-primary ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    id={name}
                    className={classNames(
                        'sb-select',
                        'appearance-none',
                        'text-inherit',
                        'bg-transparent',
                        'bg-no-repeat',
                        'border-b',
                        'border-current',
                        'cursor-pointer',
                        'w-full',
                        'py-2',
                        'pr-7',
                        'focus:outline-none'
                    )}
                    name={name}
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    {...attr}
                    {...(fieldPath && { 'data-sb-field-path': '.name#@id .name#@name .options' })}
                >
                    {!selectedValue && <option value="">Select an option...</option>}
                    {options.length > 0 &&
                        options.map((option, index) => {
                            const optionValue = typeof option === 'object' ? option.value : option;
                            const optionLabel = typeof option === 'object' ? option.label : option;
                            return <option key={index} value={optionValue}>{optionLabel}</option>;
                        })}
                </select>
                <ChevronDownIcon className="sb-select-icon w-5 h-5 absolute top-1/2 -translate-y-1/2 right-2 fill-current pointer-events-none" />
            </div>
        </div>
    );
}
