import * as React from 'react';
import classNames from 'classnames';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { getDataAttrs } from '../../../utils/get-data-attrs';
import Section from '../Section';
import { Action, Badge } from '../../atoms';
import TitleBlock from '../../blocks/TitleBlock';
import PostFeedItem from './PostFeedItem';

export default function PostFeedSection(props) {
    const {
        elementId,
        colors,
        backgroundImage,
        badge,
        title,
        subtitle,
        posts = [],
        showThumbnail,
        showExcerpt,
        showDate,
        showAuthor,
        actions = [],
        variant,
        hoverEffect,
        styles = {},
        annotatePosts,
        enableAnnotations
    } = props;

    return (
        <Section
            elementId={elementId}
            className="sb-component-post-feed-section"
            colors={colors}
            backgroundImage={backgroundImage}
            styles={styles?.self}
            {...getDataAttrs(props)}
        >
            <div className={classNames('w-full', 'flex', 'flex-col', 'items-center')}>
                {badge && <Badge {...badge} className="w-full max-w-sectionBody text-center" {...(enableAnnotations && { 'data-sb-field-path': '.badge' })} />}
                {title && (
                    <TitleBlock
                        {...title}
                        className={classNames('w-full', 'max-w-sectionBody', { 'mt-4': badge?.label })}
                        {...(enableAnnotations && { 'data-sb-field-path': '.title' })}
                    />
                )}
                {subtitle && (
                    <p
                        className={classNames(
                            'w-full',
                            'max-w-sectionBody',
                            'text-lg',
                            'sm:text-2xl',
                            'text-center',
                            styles?.subtitle ? mapStyles(styles?.subtitle) : undefined,
                            {
                                'mt-4': badge?.label || title?.text
                            }
                        )}
                        {...(enableAnnotations && { 'data-sb-field-path': '.subtitle' })}
                    >
                        {subtitle}
                    </p>
                )}
                <PostFeedVariants
                    variant={variant}
                    posts={posts}
                    showThumbnail={showThumbnail}
                    showExcerpt={showExcerpt}
                    showDate={showDate}
                    showAuthor={showAuthor}
                    hoverEffect={hoverEffect}
                    hasTopMargin={!!(badge?.label || title?.text || subtitle)}
                    hasSectionTitle={!!title?.text}
                    hasAnnotations={enableAnnotations}
                    annotatePosts={annotatePosts}
                />
                {actions.length > 0 && (
                    <div
                        className={classNames('flex', 'flex-wrap', 'items-center', 'gap-4', {
                            'mt-12': badge?.label || title?.text || subtitle || posts.length > 0
                        })}
                        {...(enableAnnotations && { 'data-sb-field-path': '.actions' })}
                    >
                        {actions.map((action, index) => (
                            <Action
                                key={index}
                                {...action}
                                className="lg:whitespace-nowrap"
                                {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Section>
    );
}

function PostFeedVariants(props) {
    const { variant = 'three-col-grid', ...rest } = props;
    switch (variant) {
        case 'two-col-grid':
            return <PostFeedTwoColGrid {...rest} />;
        case 'small-list':
            return <PostFeedSmallList {...rest} />;
        case 'big-list':
            return <PostFeedBigList {...rest} />;
        case 'carousel':
            return <PostFeedCarousel {...rest} />;
        default:
            return <PostFeedThreeColGrid {...rest} />;
    }
}

function PostFeedThreeColGrid(props) {
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
    if (posts.length === 0) {
        return null;
    }
    return (
        <div
            className={classNames('w-full', 'grid', 'gap-10', 'overflow-visible', 'sm:grid-cols-2', 'lg:grid-cols-3', {
                'mt-12': hasTopMargin
            })}
            style={{ transformStyle: 'preserve-3d' }}
            {...(hasAnnotations && annotatePosts && { 'data-sb-field-path': '.posts' })}
        >
            {posts.map((post, index) => (
                <PostFeedItem
                    key={index}
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
            ))}
        </div>
    );
}

function PostFeedTwoColGrid(props) {
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
    if (posts.length === 0) {
        return null;
    }
    return (
        <div
            className={classNames('w-full', 'grid', 'gap-10', 'overflow-visible', 'sm:grid-cols-2', { 'mt-12': hasTopMargin })}
            style={{ transformStyle: 'preserve-3d' }}
            {...(hasAnnotations && annotatePosts && { 'data-sb-field-path': '.posts' })}
        >
            {posts.map((post, index) => (
                <PostFeedItem
                    key={index}
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
            ))}
        </div>
    );
}

function PostFeedSmallList(props) {
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
    if (posts.length === 0) {
        return null;
    }
    return (
        <div
            className={classNames('w-full', 'max-w-3xl', 'grid', 'gap-10', 'overflow-visible', { 'mt-12': hasTopMargin })}
            style={{ transformStyle: 'preserve-3d' }}
            {...(hasAnnotations && annotatePosts && { 'data-sb-field-path': '.posts' })}
        >
            {posts.map((post, index) => (
                <PostFeedItem
                    key={index}
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
            ))}
        </div>
    );
}

function PostFeedBigList(props) {
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
    if (posts.length === 0) {
        return null;
    }
    return (
        <div
            className={classNames('w-full', 'grid', 'gap-10', 'overflow-visible', { 'mt-12': hasTopMargin })}
            style={{ transformStyle: 'preserve-3d' }}
            {...(hasAnnotations && annotatePosts && { 'data-sb-field-path': '.posts' })}
        >
            {posts.map((post, index) => (
                <PostFeedItem
                    key={index}
                    post={post}
                    showThumbnail={showThumbnail}
                    showExcerpt={showExcerpt}
                    showDate={showDate}
                    showAuthor={showAuthor}
                    hasSectionTitle={hasSectionTitle}
                    hasBigThumbnail={true}
                    hoverEffect={hoverEffect}
                    sectionColors={colors}
                    hasAnnotations={hasAnnotations}
                />
            ))}
        </div>
    );
}

function PostFeedCarousel(props) {
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
