import * as React from 'react';
import classNames from 'classnames';
import Section from '../Section';
import { getComponent } from '../../components-registry';

const FILTERS = [
    { id: 'all', label: 'All Tours' },
    { id: 'half-day', label: 'Half-Day' },
    { id: 'one-day', label: 'One-Day' },
    { id: '2-3-days', label: '2-3 Days' },
    { id: '5-7-days', label: '5-7 Days' }
];

const DURATION_GROUPS = [
    { id: 'half-day', label: 'Half-Day Ecotours', filter: (tag: string) => tag.includes('half-day') },
    { id: 'one-day', label: 'One-Day Ecotours', filter: (tag: string) => tag.includes('one day') },
    { id: '2-3-days', label: '2-3 Day Ecotours', filter: (tag: string) => 
        tag.includes('two') || tag.includes('three') || (tag.includes('2') && tag.includes('3'))
    }
];

export default function EcotourFilterSection(props) {
    const [activeFilter, setActiveFilter] = React.useState('all');
    const { elementId, colors, backgroundImage, items = [], styles = {} } = props;

    const filteredItems = React.useMemo(() => {
        if (activeFilter === 'all') {
            return items;
        }
        return items.filter(item => {
            const tag = (item.tagline || '').toLowerCase();
            switch (activeFilter) {
                case 'half-day':
                    return tag.includes('half-day');
                case 'one-day':
                    return tag.includes('one day');
                case '2-3-days':
                    return tag.includes('two') || tag.includes('three') || tag.includes('2') || tag.includes('3');
                case '5-7-days':
                    return tag.includes('five') || tag.includes('six') || tag.includes('seven') || tag.includes('5') || tag.includes('6') || tag.includes('7');
                default:
                    return true;
            }
        });
    }, [items, activeFilter]);

    const groupedItems = React.useMemo(() => {
        if (activeFilter === 'all') {
            return DURATION_GROUPS.map(group => ({
                label: group.label,
                items: items.filter(item => group.filter((item.tagline || '').toLowerCase()))
            })).filter(group => group.items.length > 0);
        }
        // For specific filters, show just one group with the corresponding header
        const currentGroup = DURATION_GROUPS.find(g => g.id === activeFilter);
        return [{ label: currentGroup?.label || null, items: filteredItems }];
    }, [items, filteredItems, activeFilter]);

    const EcotourCard = getComponent('EcotourCard');

    return (
        <Section
            elementId={elementId}
            className="sb-component-ecotour-filter-section"
            colors={colors}
            backgroundImage={backgroundImage}
            styles={styles?.self}
        >
            {/* Filter Buttons */}
            <div className="w-full flex flex-wrap justify-center gap-2 mb-8">
                {FILTERS.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={classNames(
                            'px-4 py-2 rounded-full font-medium border-2 transition-colors duration-200',
                            'focus:outline-none focus:ring-0',
                            activeFilter === filter.id
                                ? 'bg-primary text-white border-primary'
                                : 'bg-transparent text-gray-700 border-gray-300 hover:bg-white hover:border-primary hover:text-primary'
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Grouped Items with Headers */}
            {groupedItems.length > 0 && groupedItems.some(g => g.items.length > 0) ? (
                <div className="w-full flex flex-col gap-12">
                    {groupedItems.filter(g => g.items.length > 0).map((group, groupIndex) => (
                        <div key={groupIndex}>
                            {group.label && (
                                <h2 className="text-2xl font-bold text-center mb-6 text-primary">
                                    {group.label}
                                </h2>
                            )}
                            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                                {group.items.map((item, index) => (
                                    <EcotourCard
                                        key={index}
                                        {...item}
                                        hasSectionTitle={false}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full text-center py-12 text-gray-500">
                    <p className="text-lg">Coming Soon!</p>
                    <p className="text-sm mt-2">Contact us to inquire about custom multi-day adventures!</p>
                </div>
            )}
        </Section>
    );
}
