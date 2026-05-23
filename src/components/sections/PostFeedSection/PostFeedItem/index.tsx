import * as React from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';

import { mapStylesToClassNames as mapStyles } from '../../../../utils/map-styles-to-class-names';
import { getPageUrl } from '../../../../utils/page-utils';
import Link from '../../../atoms/Link';
import ImageBlock from '../../../blocks/ImageBlock';

export default function PostFeedItem(props) {
    const {
        post,
        showThumbnail,
        showExcerpt,
        showDate,
        showAuthor,
        hasSectionTitle,
        hoverEffect = 'move-up',
        sectionColors,
        hasAnnotations
    } = props;
    const TitleTag = hasSectionTitle ? 'h3' : 'h2';
    const hasThumbnail = !!(showThumbnail && post.featuredImage?.url);

    return (
        <Link
            href={getPageUrl(post)}
            className={classNames(
                'sb-card',
                'block',
                post.colors ?? 'bg-neutralAlt-fg-dark',
                post.styles?.self?.margin ? mapStyles({ margin: post.styles?.self?.margin }) : undefined,
                post.styles?.self?.padding ? mapStyles({ padding: post.styles?.self?.padding }) : undefined,
                post.styles?.self?.borderRadius ? mapStyles({ borderRadius: post.styles?.self?.borderRadius }) : undefined,
                post.styles?.self?.textAlign ? mapStyles({ textAlign: post.styles?.self?.textAlign }) : undefined,
                mapCardHoverStyles(hoverEffect, sectionColors),
                'rounded-2xl',
                'border',
                'border-black/10',
                'will-change-transform'
            )}
            style={{ transformStyle: 'preserve-3d' }}
            {...(hasAnnotations && { 'data-sb-object-id': post.__metadata?.id })}
        >
            <div className="flex flex-col">
                {hasThumbnail && (
                    <div className="w-full aspect-[500/300] overflow-hidden rounded-t-2xl">
                        <ImageBlock
                            {...post.featuredImage}
                            className="w-full h-full object-cover rounded-t-2xl"
                            {...(hasAnnotations && { 'data-sb-field-path': 'featuredImage' })}
                        />
                    </div>
                )}
                <div className="p-5 flex flex-col flex-grow">
                    <TitleTag className="text-xl font-serif font-semibold text-dark">
                        <span
                            className={classNames(mapCardTitleHoverStyles(hoverEffect, post.colors))}
                            {...(hasAnnotations && { 'data-sb-field-path': 'title' })}
                        >
                            {post.title}
                        </span>
                    </TitleTag>
                    <PostAttribution
                        showAuthor={showAuthor}
                        showDate={showDate}
                        date={post.date}
                        author={post.author}
                        className="mt-2 text-xs text-gray-500"
                        hasAnnotations={hasAnnotations}
                    />
                    {showExcerpt && post.excerpt && (
                        <p className="mt-3 text-base text-gray-600 leading-relaxed" {...(hasAnnotations && { 'data-sb-field-path': 'excerpt' })}>
                            {post.excerpt}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}

function PostAttribution({ showDate, showAuthor, date, author, className = '', hasAnnotations }) {
    if (!showDate && !(showAuthor && author)) {
        return null;
    }
    return (
        <div className={classNames('uppercase', className)}>
            {showAuthor && author && (
                <>
                    <span {...(hasAnnotations && { 'data-sb-field-path': 'author' })}>
                        <span {...(hasAnnotations && { 'data-sb-field-path': '.name' })}>{author.name}</span>
                    </span>
                    {showDate && <span className="mx-2">|</span>}
                </>
            )}
            {showDate && (
                <time dateTime={dayjs(date).format('YYYY-MM-DD HH:mm:ss')} {...(hasAnnotations && { 'data-sb-field-path': 'date' })}>
                    {dayjs(date).format('MMM D, YYYY')}
                </time>
            )}
        </div>
    );
}

function mapCardHoverStyles(hoverEffect: string, colors: string) {
    switch (hoverEffect) {
        case 'thin-underline':
        case 'thick-underline':
            return 'group';
        case 'move-up':
            return 'relative transition duration-200 ease-in hover:-translate-y-1.5 hover:z-10';
        case 'shadow':
            return colors === 'bg-dark-fg-light'
                ? 'relative transition duration-200 ease-in hover:shadow-2xl hover:shadow-black/60 hover:z-10'
                : 'relative transition duration-200 ease-in hover:shadow-2xl hover:z-10';
        case 'shadow-plus-move-up':
            return colors === 'bg-dark-fg-light'
                ? 'relative transition duration-200 ease-in hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1.5 hover:z-10'
                : 'relative transition duration-200 ease-in hover:shadow-2xl hover:-translate-y-1.5 hover:z-10';
        default:
            return 'relative transition duration-200 ease-in hover:-translate-y-1.5 hover:z-10';
    }
}

function mapCardTitleHoverStyles(hoverEffect: string, colors: string) {
    switch (hoverEffect) {
        case 'thin-underline':
            return colors === 'bg-dark-fg-light'
                ? 'bg-left-bottom bg-[length:0_1px] bg-no-repeat bg-gradient-to-r from-light to-light transition-[background-size] duration-300 ease-in-out group-hover:bg-[length:100%_1px]'
                : 'bg-left-bottom bg-[length:0_1px] bg-no-repeat bg-gradient-to-r from-dark to-dark transition-[background-size] duration-300 ease-in-out group-hover:bg-[length:100%_1px]';
        case 'thick-underline':
            return colors === 'bg-dark-fg-light'
                ? 'bg-left-bottom bg-[length:0_50%] bg-no-repeat bg-gradient-to-r from-light/30 to-light/30 transition-[background-size] duration-300 ease-in-out group-hover:bg-[length:100%_50%]'
                : 'bg-left-bottom bg-[length:0_50%] bg-no-repeat bg-gradient-to-r from-dark/20 to-dark/20 transition-[background-size] duration-300 ease-in-out group-hover:bg-[length:100%_50%]';
        default:
            return null;
    }
}
