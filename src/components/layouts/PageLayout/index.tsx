import * as React from 'react';

import { getBaseLayoutComponent } from '../../../utils/base-layout';
import { getComponent } from '../../components-registry';
import StickyBookingBar from '../../sections/StickyBookingBar';

// Import template-specific carousel directly to avoid dynamic import issues
import CarouselSectionTemplate from '../../sections/CarouselSectionTemplate';

export default function PageLayout(props) {
    const { page, site } = props;
    const BaseLayout = getBaseLayoutComponent(page.baseLayout, site.baseLayout);
    const { enableAnnotations = true } = site;
    const { title, sections = [] } = page;
    
    // Check if this is the ecotour-page-template
    const pageSlug = page.__metadata?.fields?.slug?.value || page.slug || '';
    const isEcotourTemplate = pageSlug.includes('ecotour-page-template');
    
    // Extract price data from SimplifiedPricingSection for StickyBookingBar
    const pricingSection = sections.find(s => s.__metadata?.modelName === 'SimplifiedPricingSection');
    let stickyBookingBarData: { price?: string; bookingUrl?: string; tourTitle?: string } = {};
    
    if (pricingSection?.plans && pricingSection.plans.length > 0) {
        // Find the lowest price (remove $ and parse as number)
        const prices = pricingSection.plans.map((plan: { price: string }) => {
            const priceNum = parseInt(plan.price.replace(/[^0-9]/g, ''), 10);
            return priceNum;
        }).filter((p: number) => !isNaN(p));
        
        const lowestPrice = prices.length > 0 ? Math.min(...prices) : 340;
        stickyBookingBarData = {
            price: `$${lowestPrice}`,
            bookingUrl: pricingSection.bookingUrl || '/book',
            tourTitle: (page.title || '').replace(/\s*Ecotour\s*/gi, '').trim()
        };
    }

    return (
        <BaseLayout page={page} site={site}>
            {/* Sticky Booking Bar - positioned below header via CSS */}
            {stickyBookingBarData.price && (
                <StickyBookingBar
                    price={stickyBookingBarData.price}
                    bookingUrl={stickyBookingBarData.bookingUrl}
                    tourTitle={stickyBookingBarData.tourTitle}
                    headerHeight={0}
                />
            )}
            <main id="main" className="sb-layout sb-page-layout">
                {title && (
                    <h1 className="sr-only" {...(enableAnnotations && { 'data-sb-field-path': 'title' })}>
                        {title}
                    </h1>
                )}
                {sections.length > 0 && (
                    <div {...(enableAnnotations && { 'data-sb-field-path': 'sections' })}>
                        {sections.map((section, index) => {
                            const modelName = section.__metadata?.modelName;
                            let Component;
                            
                            // Skip StickyBookingBar section (we render it above header instead)
                            if (modelName === 'StickyBookingBar') {
                                return null;
                            }
                            
                            // Use template-specific carousel for ecotour-page-template
                            if (isEcotourTemplate && modelName === 'CarouselSection' && section.variant === 'next-prev-nav-multiple') {
                                Component = CarouselSectionTemplate;
                            } else {
                                Component = getComponent(modelName);
                            }
                            
                            if (!Component) {
                                console.warn(`No component found for: ${modelName}`);
                                return null;
                            }
                            return (
                                <Component
                                    key={index}
                                    {...section}
                                    enableAnnotations={enableAnnotations}
                                    {...(enableAnnotations && { 'data-sb-field-path': `sections.${index}` })}
                                />
                            );
                        })}
                    </div>
                )}
            </main>
        </BaseLayout>
    );
}