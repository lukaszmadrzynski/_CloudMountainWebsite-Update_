import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import classNames from 'classnames';

import { getComponent } from '../../components-registry';
import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { getDataAttrs } from '../../../utils/get-data-attrs';
import Section from '../Section';
import TitleBlock from '../../blocks/TitleBlock';
import { Action, Badge } from '../../atoms';

export default function GenericSection(props) {
    const { elementId, colors, backgroundImage, badge, title, subtitle, text, actions = [], media, styles = {}, enableAnnotations, collapsible = false, sectionStyle } = props;
    const [isExpanded, setIsExpanded] = React.useState(false);
    const sectionRef = React.useRef<HTMLDivElement>(null);
    const hasTextContent = !!(badge?.url || title?.text || subtitle || text || actions.length > 0);
    const hasMedia = !!(media && (media?.url || (media?.fields ?? []).length > 0));
    const flexDirection = styles?.self?.flexDirection ?? (hasTextContent && hasMedia ? 'row' : 'col');
    const flexDirStr = typeof flexDirection === 'string' ? flexDirection : '';
    // Determine if we should use row layout (handles responsive values like 'col lg:flex-row')
    const useRowLayout = flexDirStr.includes('row');
    const useReversed = flexDirStr.includes('row-reverse');

    const handleToggle = () => {
        if (!collapsible) return;
        
        if (isExpanded) {
            sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                setIsExpanded(false);
            }, 200);
        } else {
            setIsExpanded(true);
        }
    };

    // Check if this is a practical info style section
    const isPracticalInfo = sectionStyle === 'practical-info';

    return (
        <Section
            elementId={elementId}
            className="sb-component-generic-section"
            colors={colors}
            backgroundImage={backgroundImage}
            styles={styles?.self}
            fullWidth={styles?.self?.fullWidth}
            {...getDataAttrs(props)}
        >
            <div
                ref={sectionRef}
className={classNames(
                    'w-full',
                    'flex',
                    mapStyles({ flexDirection }) || 'flex-col',
                    'items-center',
                    'justify-center',
                    'gap-x-12',
                    'gap-y-4',
                    'lg:gap-y-16'
                )}
            >
                {/* Text Content */}
                {hasTextContent && (
                    <div
                        className={classNames('w-full', 'max-w-sectionBody', {
                            'lg:max-w-[27.5rem]': hasMedia && useRowLayout
                        })}
                    >
                        {badge && (
                            <div className="text-center">
                                <button 
                                    onClick={handleToggle}
                                    className={classNames(
                                        'inline-block',
                                        collapsible && 'cursor-pointer hover:opacity-80 transition-opacity'
                                    )}
                                    aria-expanded={isExpanded}
                                    aria-controls={`${elementId}-content`}
                                >
                                    <Badge {...badge} />
                                </button>
                            </div>
                        )}
                        {title && (
                            <div className="text-center">
                                <button 
                                    onClick={handleToggle}
                                    className={classNames(
                                        'w-full',
                                        collapsible && 'cursor-pointer hover:opacity-80 transition-opacity'
                                    )}
                                    disabled={!collapsible}
                                >
                                    <TitleBlock
                                        {...title}
                                        className={classNames({ 'mt-4': badge?.label })}
                                        {...(enableAnnotations && { 'data-sb-field-path': '.title' })}
                                    />
                                </button>
                            </div>
                        )}
                        {subtitle && (
                            <p
                                className={classNames('text-center', 'text-lg', 'sm:text-xl', 'mt-4', 'text-gray-600', styles?.subtitle ? mapStyles(styles?.subtitle) : undefined, {
                                    'mt-4': badge?.label || title?.text
                                })}
                                {...(enableAnnotations && { 'data-sb-field-path': '.subtitle' })}
                            >
                                {subtitle}
                            </p>
                        )}
                        
                        {/* Collapsible Content */}
                        <div 
                            id={elementId ? `${elementId}-content` : undefined}
                            className={classNames(
                                'overflow-hidden transition-all ease-in-out w-full',
                                collapsible ? (isExpanded ? 'max-h-[3000px] opacity-100 mt-8' : 'max-h-0 opacity-0') : 'mt-8'
                            )}
                            style={{ transitionDuration: '800ms' }}
                        >
                            {text && (
                                <div
                                    className={classNames(
                                        'sb-markdown',
                                        styles?.text ? mapStyles(styles.text) : 'text-center'
                                    )}
                                    style={!styles?.text?.color ? { color: 'inherit' } : undefined}
                                    {...(enableAnnotations && { 'data-sb-field-path': '.text' })}
                                >
                                    {isPracticalInfo ? (
                                        <div className="space-y-3">
                                            {text.split('\n').filter(line => line.trim()).map((line, index) => {
                                                const cleanLine = line.replace(/^[-•*]\s*/, '').trim();
                                                const isBold = cleanLine.match(/^\*\*(.+?)\*\*/);
                                                return (
                                                    <div key={index} className="flex items-start text-left">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-[#5ebb46] mt-2 mr-3 flex-shrink-0"></span>
                                                        <span className="text-gray-700 text-base leading-relaxed">
                                                            {isBold ? (
                                                                <>
                                                                    <strong className="font-semibold">{isBold[1]}</strong>
                                                                    {cleanLine.replace(/^\*\*(.+?)\*\*:?\s*/, '')}
                                                                </>
                                                            ) : cleanLine}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <Markdown options={{ 
                                            overrides: { 
                                                ul: { props: { className: 'space-y-3 list-none pl-0' } },
                                                li: { 
                                                    props: { 
                                                        className: 'flex items-start text-left',
                                                        style: { listStyleType: 'none' }
                                                    } 
                                                },
                                                p: { props: { className: 'mb-3 text-base leading-relaxed text-center' } },
                                                strong: { props: { className: 'font-semibold text-gray-800' } }
                                            }
                                        }}>{text}</Markdown>
                                    )}
                                </div>
                            )}
                            
                            {/* Actions */}
                            {actions.length > 0 && (
                                <div
                                    className={classNames(
                                        'flex',
                                        'flex-wrap',
                                        'justify-center',
                                        'items-center',
                                        'gap-4',
                                        'mt-6',
                                        'pb-6',
                                        'w-full'
                                    )}
                                    {...(enableAnnotations && { 'data-sb-field-path': '.actions' })}
                                >
                                    {actions.map((action, index) => (
                                        <Action
                                            key={index}
                                            {...action}
                                            className={classNames(
                                                'lg:whitespace-nowrap',
                                                'min-w-[200px]',
                                                '!justify-center',
                                                actions.length > 1 && index < actions.length - 1 ? 'sm:min-w-[240px]' : ''
                                            )}
                                            {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Toggle button for collapsible sections */}
                        {collapsible && (
                            <div className="w-full flex justify-center mt-6">
                                <button
                                    onClick={handleToggle}
                                    className={classNames(
                                        'flex items-center gap-2 px-6 py-2 rounded-full border-2 border-[#5ebb46]',
                                        'transition-all duration-300 font-medium',
                                        isExpanded 
                                            ? 'text-[#5ebb46] hover:bg-[#5ebb46]/10' 
                                            : 'bg-white text-[#5ebb46] hover:bg-[#5ebb46]/10'
                                    )}
                                    aria-expanded={isExpanded}
                                >
                                    <span>{isExpanded ? 'Click to Collapse' : 'Click to Expand'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Media */}
                {hasMedia && (
                    <div
                        className={classNames('w-full', 'flex', 'justify-center', {
                            'max-w-sectionBody': media.__metadata.modelName === 'FormBlock',
                            'lg:w-[57.5%] lg:shrink-0': hasTextContent && useRowLayout
                        })}
                    >
                        <Media media={media} hasAnnotations={enableAnnotations} />
                    </div>
                )}
            </div>
        </Section>
    );
}

function Media({ media, hasAnnotations }: { media: any; hasAnnotations: boolean }) {
    const modelName = media.__metadata.modelName;
    if (!modelName) {
        throw new Error(`generic section media does not have the 'modelName' property`);
    }
    const MediaComponent = getComponent(modelName);
    if (!MediaComponent) {
        throw new Error(`no component matching the hero section media model name: ${modelName}`);
    }
    return <MediaComponent {...media} {...(hasAnnotations && { 'data-sb-field-path': '.media' })} />;
}
