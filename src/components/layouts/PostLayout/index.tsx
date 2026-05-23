import * as React from 'react';
import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';

import { getBaseLayoutComponent } from '../../../utils/base-layout';
import { getComponent } from '../../components-registry';
import Link from '../../atoms/Link';

export default function PostLayout(props) {
    const { page, site } = props;
    const BaseLayout = getBaseLayoutComponent(page.baseLayout, site.baseLayout);
    const { enableAnnotations = true } = site;
    const { title, date, author, markdown_content, bottomSections = [], featuredImage } = page;
    const dateTimeAttr = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    const formattedDate = dayjs(date).format('MMMM D, YYYY');

    return (
        <BaseLayout page={page} site={site}>
            <main id="main" className="sb-layout sb-post-layout">
                {featuredImage && (
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden mb-0" style={{ minHeight: '50vh' }}>
                        <img
                            src={featuredImage.url}
                            alt={featuredImage.altText || ''}
                            className="w-full object-cover"
                            style={{ minHeight: '50vh', maxHeight: '65vh' }}
                        />
                    </div>
                )}
                <article className="bg-light-fg-dark px-4 sm:px-8 py-12 sm:py-16">
                    <div className="max-w-screen-xl mx-auto">
                        <header className="max-w-3xl mx-auto mb-12 sm:mb-16 text-center">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold leading-tight" {...(enableAnnotations && { 'data-sb-field-path': 'title' })}>{title}</h1>
                            <div className="text-xs sm:text-sm uppercase tracking-wider mt-4 sm:mt-6 text-gray-500">
                                <time dateTime={dateTimeAttr} {...(enableAnnotations && { 'data-sb-field-path': 'date' })}>
                                    {formattedDate}
                                </time>
                                {author && (
                                    <>
                                        <span className="mx-2">|</span>
                                        <PostAuthor author={author} enableAnnotations={enableAnnotations} />
                                    </>
                                )}
                            </div>
                        </header>
                        {markdown_content && (
                            <Markdown
                                options={{ forceBlock: true }}
                                className="sb-markdown max-w-3xl mx-auto text-base sm:text-lg leading-relaxed"
                                {...(enableAnnotations && { 'data-sb-field-path': 'markdown_content' })}
                            >
                                {markdown_content}
                            </Markdown>
                        )}
                    </div>
                </article>
                {bottomSections.length > 0 && (
                    <div {...(enableAnnotations && { 'data-sb-field-path': 'bottomSections' })}>
                        {bottomSections.map((section, index) => {
                            const Component = getComponent(section.__metadata.modelName);
                            if (!Component) {
                                throw new Error(`no component matching the page section's model name: ${section.__metadata.modelName}`);
                            }
                            return (
                                <Component
                                    key={index}
                                    {...section}
                                    enableAnnotations={enableAnnotations}
                                    {...(enableAnnotations && { 'data-sb-field-path': `bottomSections.${index}` })}
                                />
                            );
                        })}
                    </div>
                )}
            </main>
        </BaseLayout>
    );
}

function PostAuthor({ author, enableAnnotations }) {
    const authorName = author.name && <span {...(enableAnnotations && { 'data-sb-field-path': '.name' })}>{author.name}</span>;
    return author.slug ? (
        <Link {...(enableAnnotations && { 'data-sb-field-path': 'author' })} href={`/blog/author/${author.slug}`}>
            {authorName}
        </Link>
    ) : (
        <span {...(enableAnnotations && { 'data-sb-field-path': 'author' })}>{authorName}</span>
    );
}

/*
function PostCategory({ category, enableAnnotations }) {
    if (!category) {
        return null;
    }
    return (
        <div className="mb-4">
            <Link {...(enableAnnotations && { 'data-sb-field-path': 'category' })} href={category.__metadata?.urlPath}>
                {category.title}
            </Link>
        </div>
    );
}
*/
