import * as React from 'react';
import classNames from 'classnames';
import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { getDataAttrs } from '../../../utils/get-data-attrs';
import { getComponent } from '../../components-registry';
import Section from '../Section';
import Badge from '../../atoms/Badge';
import TitleBlock from '../../blocks/TitleBlock';

const INITIAL_SHOW_COUNT = 3;

export default function CarouselSection(props) {
    const { elementId, colors, backgroundImage, badge, title, subtitle, items = [], variant, styles = {}, enableAnnotations } = props;
    const FeaturedItem = getComponent('FeaturedItem');
    const [showAll, setShowAll] = React.useState(false);
    const sectionRef = React.useRef(null);

    const handleToggle = () => {
        // On "Show Less": scroll to EcoTour Itinerary section
        if (showAll) {
            // Get all section elements on the page
            const allSections = Array.from(document.querySelectorAll('section, .sb-component-section'));
            
            // Find EcoTour Itinerary section by looking for sections that contain "EcoTour Itinerary"
            for (const section of allSections) {
                const text = section.textContent || '';
                if (text.includes('EcoTour Itinerary')) {
                    const headerOffset = 80;
                    const rect = section.getBoundingClientRect();
                    const top = rect.top + window.scrollY - headerOffset;
                    window.scrollTo({ top, behavior: 'smooth' });
                    break;
                }
            }
        }
        setShowAll(!showAll);
    };

    const hasMore = items.length > INITIAL_SHOW_COUNT;

    const secondaryButtonStyle = {
        padding: '8px 24px',
        fontSize: '16px',
        fontWeight: '500',
        color: '#5ebb46',
        backgroundColor: 'transparent',
        border: '2px solid #5ebb46',
        borderRadius: '9999px', // rounded-full
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    return (
        <Section 
            elementId={elementId} 
            className="sb-component-carousel-section" 
            colors={colors} 
            backgroundImage={backgroundImage} 
            styles={styles?.self} 
            {...getDataAttrs(props)}
            ref={sectionRef}
        >
            <div className={classNames('w-full', 'flex', 'flex-col', mapStyles({ alignItems: styles?.self?.justifyContent ?? 'flex-start' }))}>
                {badge && <Badge {...badge} className="w-full max-w-sectionBody" {...(enableAnnotations && { 'data-sb-field-path': '.badge' })} />}
                {title && <TitleBlock {...title} className={classNames('w-full', 'max-w-sectionBody', { 'mt-4': badge?.label })} {...(enableAnnotations && { 'data-sb-field-path': '.title' })} />}
                {subtitle && <p className={classNames('w-full', 'max-w-sectionBody', 'text-lg', 'sm:text-2xl', styles?.subtitle ? mapStyles(styles?.subtitle) : undefined, { 'mt-4': badge?.label || title?.text })} {...(enableAnnotations && { 'data-sb-field-path': '.subtitle' })}>{subtitle}</p>}
                {items.length > 0 && (
                    <div className="w-full mt-12">
                        {/* Animated grid container */}
                        <div 
                            style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: '24px', 
                                justifyContent: 'center',
                                maxWidth: '1200px',
                                margin: '0 auto',
                                overflow: 'hidden',
                                maxHeight: showAll ? '5000px' : '800px',
                                transition: 'max-height 0.6s ease-in-out',
                                opacity: 1
                            }}
                        >
                            {items.map((item, index) => (
                                <div 
                                    key={index} 
                                    style={{ 
                                        minWidth: '300px', 
                                        maxWidth: '350px', 
                                        flex: '1 1 300px'
                                    }}
                                    {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })}
                                >
                                    <FeaturedItem {...item} hasSectionTitle={!!title?.text} />
                                </div>
                            ))}
                        </div>
                        
                        {/* Show More / Show Less Button - Secondary Style */}
                        {hasMore && (
                            <div style={{ textAlign: 'center', marginTop: '32px' }}>
                                <button
                                    onClick={handleToggle}
                                    style={secondaryButtonStyle}
                                    onMouseEnter={(e) => {
                                        (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(94, 187, 70, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                                    }}
                                    type="button"
                                >
                                    {showAll ? 'Show Less Highlights' : `Show All Highlights (${items.length})`}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Section>
    );
}