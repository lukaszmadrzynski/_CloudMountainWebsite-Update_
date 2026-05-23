import * as React from 'react';
import classNames from 'classnames';
import Section from '../Section';
import TitleBlock from '../../blocks/TitleBlock';
import { Badge } from '../../atoms';

interface AccordionItem {
    question: string;
    answer: string;
}

export default function AccordionSection(props) {
    const { elementId, colors, backgroundImage, badge, title, subtitle, items = [], styles = {}, enableAnnotations } = props;
    const [showQuestions, setShowQuestions] = React.useState(false);
    const [expandedItems, setExpandedItems] = React.useState<Set<number>>(new Set());

    const toggleItem = (index: number) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <Section
            elementId={elementId}
            className="sb-component-accordion-section"
            colors={colors}
            backgroundImage={backgroundImage}
            styles={styles?.self}
        >
            <div className="w-full max-w-3xl mx-auto px-4">
                {badge && <Badge {...badge} className="text-center block mb-3" />}
                {title && (
                    <TitleBlock
                        {...title}
                        className="text-center"
                    />
                )}
                {subtitle && (
                    <p className="text-center text-gray-600 mt-2 mb-8">
                        {subtitle}
                    </p>
                )}
                
                {/* Show All Button - initially this is the only thing visible */}
                {items.length > 0 && !showQuestions && (
                    <div className="w-full flex justify-center">
                        <button
                            onClick={() => setShowQuestions(true)}
                            className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-[#5ebb46] text-[#5ebb46] hover:bg-[#5ebb46]/10 transition-all duration-300 font-medium"
                        >
                            <span>Show all Questions</span>
                        </button>
                    </div>
                )}
                
                {/* Questions List - hidden until Show All is clicked */}
                <div
                    className={classNames(
                        'space-y-3 transition-all duration-800 ease-in-out',
                        showQuestions ? 'opacity-100 max-h-[5000px] translate-y-0' : 'opacity-0 max-h-0 -translate-y-4 overflow-hidden'
                    )}
                    style={{ transitionDuration: '800ms' }}
                >
                    {showQuestions && (
                        <>
                            {/* Collapse Button */}
                            <div className="mb-6 w-full flex justify-center">
                                <button
                                    onClick={() => {
                                        setShowQuestions(false);
                                        setExpandedItems(new Set());
                                    }}
                                    className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-[#5ebb46] text-[#5ebb46] hover:bg-[#5ebb46]/10 transition-all duration-300 font-medium"
                                >
                                    <span>Hide Questions</span>
                                </button>
                            </div>
                            
                            {items.map((item: AccordionItem, index: number) => (
                                <AccordionItemComponent
                                    key={index}
                                    question={item.question}
                                    answer={item.answer}
                                    isExpanded={expandedItems.has(index)}
                                    onToggle={() => toggleItem(index)}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </Section>
    );
}

function AccordionItemComponent({ question, answer, isExpanded = false, onToggle }: { question: string; answer: string; isExpanded?: boolean; onToggle: () => void }) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-4">
            <button
                className="w-full text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={onToggle}
            >
                <span className="font-semibold text-gray-900 pr-4">{question}</span>
                <span className={classNames(
                    'text-[#5ebb46] font-medium transition-transform duration-300 flex-shrink-0',
                    isExpanded && 'rotate-180'
                )}>
                    ▼
                </span>
            </button>
            <div className={classNames(
                'overflow-hidden transition-all duration-800 ease-in-out',
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}>
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}
