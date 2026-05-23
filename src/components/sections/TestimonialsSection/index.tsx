import * as React from 'react';
import classNames from 'classnames';

import { getDataAttrs } from '../../../utils/get-data-attrs';
import Section from '../Section';
import TitleBlock from '../../blocks/TitleBlock';

export default function TestimonialsSection(props) {
    const {
        elementId,
        colors,
        backgroundImage,
        title,
        subtitle,
        testimonials = [],
        cta,
        styles = {},
        enableAnnotations
    } = props;

    return (
        <Section
            elementId={elementId}
            className="sb-component-testimonials-section"
            colors={colors}
            backgroundImage={backgroundImage}
            styles={styles?.self}
            {...getDataAttrs(props)}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {title && (
                    <TitleBlock
                        {...title}
                        className="text-center mb-4"
                        {...(enableAnnotations && { 'data-sb-field-path': '.title' })}
                    />
                )}
                {subtitle && (
                    <p className="text-center text-lg text-gray-600 mb-12">
                        {subtitle}
                    </p>
                )}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-md"
                            {...(enableAnnotations && { 'data-sb-field-path': `testimonials.${index}` })}
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-yellow-400 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <blockquote className="text-gray-700 mb-4">
                                <p className="text-sm leading-relaxed">"{testimonial.quote}"</p>
                            </blockquote>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                                        {testimonial.author.charAt(0)}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-900">{testimonial.author}</p>
                                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {cta && (
                    <div className="mt-12 text-center">
                        <a
                            href={cta.url}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 transition-colors"
                        >
                            {cta.label}
                        </a>
                    </div>
                )}
            </div>
        </Section>
    );
}
