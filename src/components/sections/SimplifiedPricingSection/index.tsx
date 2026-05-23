import * as React from 'react';
import classNames from 'classnames';
import Section from '../Section';
import TitleBlock from '../../blocks/TitleBlock';
import { Badge } from '../../atoms';

interface PricingPlan {
    people: string;
    price: string;
    url?: string;
}

interface SimplifiedPricingSectionProps {
    elementId?: string;
    colors?: string;
    backgroundImage?: any;
    badge?: any;
    title?: any;
    subtitle?: string;
    plans?: PricingPlan[];
    contactNote?: {
        text: string;
        url: string;
    };
    included?: {
        text: string;
        notIncluded?: string;
        meetingPoint?: string;
    };
    bookingUrl?: string;
    styles?: any;
}

export default function SimplifiedPricingSection(props: SimplifiedPricingSectionProps) {
    const { elementId, colors, backgroundImage, badge, title, subtitle, plans = [], contactNote, included, bookingUrl, styles = {} } = props;

    return (
        <Section
            elementId={elementId}
            className="sb-component-simplified-pricing-section"
            colors={colors}
            backgroundImage={backgroundImage}
            styles={styles?.self}
        >
            <div className="w-full max-w-5xl mx-auto text-center py-0">
                {badge && <Badge {...badge} className="mb-4" />}
                {title && <TitleBlock {...title} className="text-center" />}
                {subtitle && (
                    <p className="text-gray-600 mt-3 text-lg">{subtitle}</p>
                )}
                
                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {plans.map((plan, index) => (
                        <a
                            key={index}
                            href={plan.url || `/book?tour=Shangri-La+Monkey+Trip&group=${encodeURIComponent(plan.people)}`}
                            className={classNames(
                                'group',
                                'bg-white rounded-2xl p-8',
                                'border-2 border-[#5ebb46]',
                                'transition-all duration-300',
                                'cursor-pointer',
                                'block'
                            )}
                        >
                            <div className="text-gray-500 font-medium mb-2">{plan.people}</div>
                            <div className="text-5xl font-bold text-[#5ebb46] mb-2">{plan.price}</div>
                            <div className="text-gray-400 text-sm">per person</div>
                        </a>
                    ))}
                </div>
                
                {/* Contact Note - Italic Style */}
                {contactNote && (
                    <p className="mt-8 text-gray-600 italic">
                        {contactNote.text}{' '}
                        <a 
                            href={contactNote.url} 
                            className="text-[#5ebb46] hover:text-[#4aa638] underline transition-colors not-italic font-medium"
                        >
                            Contact us
                        </a>
                    </p>
                )}
                
                {/* Merged What's Included Section */}
                {included && (
                    <div className="mt-8 text-left max-w-3xl mx-auto">
                        {included.text && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">What's Included</h4>
                                <p className="text-gray-600">{included.text.replace(/\*\*/g, '')}</p>
                            </div>
                        )}
                        {included.notIncluded && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">Not Included</h4>
                                <p className="text-gray-600">{included.notIncluded}</p>
                            </div>
                        )}
                        {included.meetingPoint && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">Meeting Point</h4>
                                <p className="text-gray-600">{included.meetingPoint}</p>
                            </div>
                        )}
                        
                        {/* Booking Button */}
                        {bookingUrl && (
                            <div className="mt-6 flex justify-center">
                                <a
                                    href={bookingUrl}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#5ebb46] hover:bg-[#4aa638] text-white font-semibold rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Book Now
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Section>
    );
}
