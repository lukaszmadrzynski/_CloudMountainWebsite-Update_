import * as React from 'react';
import classNames from 'classnames';
import Section from '../Section';
import TitleBlock from '../../blocks/TitleBlock';
import { Badge } from '../../atoms';
import { getComponent } from '../../components-registry';

const INITIAL_SHOW_COUNT = 3;

export default function HighlightsSection(props) {
    const { elementId, colors, backgroundImage, badge, title, subtitle, items = [], styles = {}, enableAnnotations } = props;
    const FeaturedItem = getComponent('FeaturedItem');
    const sectionRef = React.useRef(null);
    const gridRef = React.useRef(null);
    const buttonRef = React.useRef(null);
    const [showAll, setShowAll] = React.useState(false);
    
    const handleToggle = () => {
        // On "Show Less": scroll to EcoTour Itinerary section
        if (showAll) {
            // Update state first, then scroll immediately (no delay)
            setShowAll(false);
            
            // Scroll immediately after state update
            requestAnimationFrame(() => {
                const targetSection = document.querySelector('.sb-component-itinerary-section') as HTMLElement;
                
                if (targetSection) {
                    const rect = targetSection.getBoundingClientRect();
                    const currentScroll = window.scrollY;
                    // Desktop: 200px, Tablet/Mobile: 150px (scroll higher to show more page content)
                    const offset = window.innerWidth >= 1024 ? 200 : 250;
                    const targetTop = rect.top + currentScroll - offset;
                    window.scrollTo({ top: targetTop, behavior: 'smooth' });
                }
            });
            return;
        }
        
        // On "Show All"
        setShowAll(true);
    };

    const hasMore = items.length > INITIAL_SHOW_COUNT;

    const buttonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 24px',
        fontSize: '16px',
        fontWeight: '500',
        color: '#5ebb46',
        backgroundColor: 'transparent',
        border: '2px solid #5ebb46',
        borderRadius: '9999px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    return (
        <Section
            elementId={elementId}
            className="sb-component-highlights-section"
            colors={colors}
            backgroundImage={backgroundImage}
            styles={styles?.self}
        >
            <div ref={sectionRef} className="w-full max-w-5xl mx-auto">
                {badge && <Badge {...badge} className="text-center block mb-3" />}
                {title && (
                    <TitleBlock
                        {...title}
                        className="text-center"
                    />
                )}
                {subtitle && (
                    <p className="text-center text-gray-600 mt-2 mb-8 text-lg sm:text-2xl">
                        {subtitle}
                    </p>
                )}
                
                {/* Animated Container - uses CSS animation for fade-in */}
                <div className="relative">
                    <div 
                        ref={gridRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {/* First 3 cards - always visible */}
                        {items.slice(0, INITIAL_SHOW_COUNT).map((item, index) => (
                            <div 
                                key={`visible-${index}`}
                                {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })}
                            >
                                <FeaturedItem {...item} hasSectionTitle={!!title?.text} />
                            </div>
                        ))}
                        
                        {/* Additional cards - only shown when showAll is true */}
                        {showAll && items.slice(INITIAL_SHOW_COUNT).map((item, index) => {
                            const actualIndex = index + INITIAL_SHOW_COUNT;
                            return (
                                <div 
                                    key={`hidden-${actualIndex}`}
                                    className="highlight-fade-in"
                                    style={{ animationDelay: `${index * 200}ms` }}
                                    {...(enableAnnotations && { 'data-sb-field-path': `.${actualIndex}` })}
                                >
                                    <FeaturedItem {...item} hasSectionTitle={!!title?.text} />
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* CSS for fade animation */}
                    {showAll && (
                        <style jsx global>{`
                            .highlight-fade-in {
                                opacity: 0;
                                animation: highlightsFadeIn 1s ease forwards;
                            }
                            @keyframes highlightsFadeIn {
                                from { opacity: 0; }
                                to { opacity: 1; }
                            }
                        `}</style>
                    )}
                    
                    {/* Collapse Overlay - shows during collapse */}
                    {!showAll && items.length > INITIAL_SHOW_COUNT && (
                        <div 
                            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                            style={{
                                background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%)',
                                transition: 'opacity 0.8s ease'
                            }}
                        />
                    )}
                </div>

                {/* Show All / Show Less Button */}
                {hasMore && (
                    <div className="w-full flex justify-center mt-10">
                        <button
                            ref={buttonRef}
                            onClick={handleToggle}
                            style={buttonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(94, 187, 70, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <span>{showAll ? 'Show Less Highlights' : `Show All Highlights (${items.length})`}</span>
                        </button>
                    </div>
                )}
            </div>
            
            
        </Section>
    );
}