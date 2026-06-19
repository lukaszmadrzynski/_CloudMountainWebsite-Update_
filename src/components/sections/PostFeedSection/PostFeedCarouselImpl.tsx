import * as React from 'react';
import classNames from 'classnames';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import PostFeedItem from './PostFeedItem';

// This is the actual carousel implementation. It's only loaded when a
// PostFeedSection uses the `carousel` variant — see PostFeedSection/index.tsx
// for the React.lazy wrapper. This way the Swiper chunk (~1.85 MB) does not
// ship on pages that don't use the carousel.

export function PostFeedCarouselImpl(props) {
    const {
        posts = [],
        showThumbnail,
        showExcerpt,
        showDate,
        showAuthor,
        hasTopMargin,
        hasSectionTitle,
        hoverEffect,
        colors,
        hasAnnotations,
        annotatePosts
    } = props;
    const [swiper, setSwiper] = React.useState(null);
    const [activeIndex, setActiveIndex] = React.useState(0);

    if (posts.length === 0) {
        return null;
    }
    return (
        <div className={classNames('relative', 'w-full', 'overflow-visible', { 'mt-12': hasTopMargin })}>
            <div className="overflow-visible w-full pt-4 pb-4">
                <Swiper
                    onSwiper={setSwiper}
                    onSlideChange={(s) => setActiveIndex(s.activeIndex)}
                    modules={[Navigation, Pagination]}
                    spaceBetween={24}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 24 }
                    }}
                    navigation
                    className="pb-0 w-full"
                >
                {posts.map((post, index) => (
                    <SwiperSlide key={index} className="w-full overflow-visible">
                        <PostFeedItem
                            post={post}
                            showThumbnail={showThumbnail}
                            showExcerpt={showExcerpt}
                            showDate={showDate}
                            showAuthor={showAuthor}
                            hasSectionTitle={hasSectionTitle}
                            hoverEffect={hoverEffect}
                            sectionColors={colors}
                            hasAnnotations={hasAnnotations}
                        />
                    </SwiperSlide>
                ))}
                </Swiper>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6 pb-4">
                <button
                    onClick={() => swiper?.slidePrev()}
                    className="w-10 h-10 flex items-center justify-center cursor-pointer hover:opacity-60 transition-opacity text-dark"
                    aria-label="Previous slide"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <div className="flex items-center gap-2">
                    {posts.map((_, index) => (
                        <span
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${index === activeIndex ? 'bg-primary w-3' : 'bg-gray-300 hover:bg-gray-400'}`}
                            onClick={() => swiper?.slideTo(index)}
                        />
                    ))}
                </div>
                <button
                    onClick={() => swiper?.slideNext()}
                    className="w-10 h-10 flex items-center justify-center cursor-pointer hover:opacity-60 transition-opacity text-dark"
                    aria-label="Next slide"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    );
}
