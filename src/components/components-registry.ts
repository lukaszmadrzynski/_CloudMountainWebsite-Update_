import { ComponentType } from 'react';

// Plain ES imports for every component in the registry.
//
// Why no next/dynamic: this project uses `output: 'export'` (full static
// export). With that mode, components that come through `next/dynamic`
// are NOT server-rendered even when `ssr: true` is specified — the
// generated HTML is an empty <div id="__next"> shell with all the page
// data in a <script id="__NEXT_DATA__"> tag, and React hydrates the
// entire page on the client. As a side effect, the FOOTER ends up at
// the top of the content area (right under the fixed header) in the
// initial HTML, then sections stream in and push the footer down
// ~700px — a catastrophic CLS (0.4+ score on every page).
//
// Plain imports: every component is bundled into the main JS chunk and
// server-rendered to static HTML at build time. The footer lands in its
// final position from the very first paint, CLS = 0 for this issue.
// Code-splitting is not critical for a static export (all chunks ship
// anyway, just on the same initial request).

// Sections
import AccordionSection from './sections/AccordionSection';
import CarouselSection from './sections/CarouselSection';
import DividerSection from './sections/DividerSection';
import EcotoursHeroSection from './sections/EcotoursHeroSection';
import FeaturedItemsSection from './sections/FeaturedItemsSection';
import FeaturedItemsSectionShowMore from './sections/FeaturedItemsSectionShowMore';
import FeaturedPeopleSection from './sections/FeaturedPeopleSection';
import FeaturedPostsSection from './sections/FeaturedPostsSection';
import GenericSection from './sections/GenericSection';
import HeroSection from './sections/HeroSection';
import HighlightsSection from './sections/HighlightsSection';
import HomepageHeroSection from './sections/HomepageHeroSection';
import ImageGallerySection from './sections/ImageGallerySection';
import ItinerarySection from './sections/ItinerarySection';
import KeyDetailsSection from './sections/KeyDetailsSection';
import PartnerWithUsHeroSection from './sections/PartnerWithUsHeroSection';
import PostFeedSection from './sections/PostFeedSection';
import PricingSection from './sections/PricingSection';
import RecentPostsSection from './sections/RecentPostsSection';
import SimplifiedPricingSection from './sections/SimplifiedPricingSection';
import StickyBookingBar from './sections/StickyBookingBar';
import TestimonialsSection from './sections/TestimonialsSection';
import TripAdvisorReviews from './sections/TripAdvisorReviews';

// Section sub-components
import EcotourFilterSection from './sections/EcotourFilterSection';
import EcotourCard from './sections/FeaturedItemsSection/EcotourCard';
import FeaturedItem from './sections/FeaturedItemsSection/FeaturedItem';
import FeaturedItemToggle from './sections/FeaturedItemsSection/FeaturedItemToggle';

// Blocks
import CheckboxFormControl from './blocks/FormBlock/CheckboxFormControl';
import EmailFormControl from './blocks/FormBlock/EmailFormControl';
import FormBlock from './blocks/FormBlock';
import ImageBlock from './blocks/ImageBlock';
import SelectFormControl from './blocks/FormBlock/SelectFormControl';
import TextareaFormControl from './blocks/FormBlock/TextareaFormControl';
import TextFormControl from './blocks/FormBlock/TextFormControl';
import VideoBlock from './blocks/VideoBlock';
import AutoCompletePosts from './blocks/SearchBlock/AutoCompletePosts';

// Layouts
import PageLayout from './layouts/PageLayout';
import PostLayout from './layouts/PostLayout';
import PostFeedLayout from './layouts/PostFeedLayout';
import PostFeedCategoryLayout from './layouts/PostFeedCategoryLayout';

const components: Record<string, ComponentType> = {
    // Sections
    AccordionSection,
    AccordionItem: AccordionSection,
    CarouselSection,
    DividerSection,
    EcotoursHeroSection,
    FeaturedItemsSection,
    FeaturedItemsSectionShowMore,
    FeaturedPeopleSection,
    FeaturedPostsSection,
    GenericSection,
    HeroSection,
    HighlightsSection,
    HomepageHeroSection,
    ImageGallerySection,
    ItinerarySection,
    KeyDetailsSection,
    PartnerWithUsHeroSection,
    PostFeedSection,
    PricingSection,
    RecentPostsSection,
    SimplifiedPricingSection,
    StickyBookingBar,
    TestimonialsSection,
    TripAdvisorReviews,

    // Section sub-components
    EcotourFilterSection,
    EcotourCard,
    FeaturedItem,
    FeaturedItemToggle,

    // Blocks
    CheckboxFormControl,
    EmailFormControl,
    FormBlock,
    ImageBlock,
    SelectFormControl,
    TextareaFormControl,
    TextFormControl,
    VideoBlock,
    AutoCompletePosts,

    // Layouts
    PageLayout,
    PostLayout,
    PostFeedLayout,
    PostFeedCategoryLayout
};

/**
 * The getComponent() function returns a component by its model name.
 * Use this when you have a content modelName and need to render the
 * matching component:
 *
 *     const Section = getComponent(section.__metadata.modelName);
 *     return <Section {...section} />;
 */
export function getComponent(key: string): ComponentType {
    return components[key];
}
