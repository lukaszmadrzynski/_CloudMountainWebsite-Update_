import * as React from 'react';
import classNames from 'classnames';

const CARD_WIDTH = 280;
const CARD_WIDTH_MOBILE = 85; // Percentage of screen width on mobile
const CARD_MARGIN = 16;
const CARD_MARGIN_MOBILE = 8;

const BubbleRating = () => (
    <svg viewBox="0 0 2894 543" className="h-3 md:h-4 w-auto">
        <g clipPath="url(#clip0)">
            <circle cx="271.312" cy="271.312" r="271.312" fill="#00AA6C"/>
            <circle cx="859.156" cy="271.312" r="271.312" fill="#00AA6C"/>
            <circle cx="1447" cy="271.312" r="271.312" fill="#00AA6C"/>
            <circle cx="2034.84" cy="271.312" r="271.312" fill="#00AA6C"/>
            <circle cx="2622.69" cy="271.312" r="271.312" fill="#00AA6C"/>
        </g>
        <defs>
            <clipPath id="clip0">
                <rect width="2894" height="542.625" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

function ReviewCard({ review, cardWidth, cardMargin }) {
    const [expanded, setExpanded] = React.useState(false);
    const textRef = React.useRef(null);
    const [isOverflowing, setIsOverflowing] = React.useState(false);

    React.useEffect(() => {
        const checkOverflow = () => {
            if (textRef.current) {
                setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
            }
        };
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [review.text]);

    const tripAdvisorUrl = 'https://www.tripadvisor.com/Attraction_Review-g303783-d17638375-Reviews-Lijiang_Cloud_Mountain_Ecotours-Lijiang_Yunnan.html';
    
    return (
        <div 
            className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-5 flex-shrink-0" 
            style={{ width: cardWidth, marginLeft: cardMargin, marginRight: cardMargin }}
        >
            <div className="flex items-center gap-3 mb-3">
                <a 
                    href={tripAdvisorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 overflow-hidden hover:opacity-80 transition-opacity"
                    title="View on TripAdvisor"
                >
                    {review.image ? (
                        <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                    ) : (
                        review.avatar
                    )}
                </a>
                <a 
                    href={tripAdvisorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 hover:opacity-80 transition-opacity"
                    title="View on TripAdvisor"
                >
                    <p className="font-semibold text-gray-900 text-sm truncate">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                </a>
            </div>

            <a 
                href={tripAdvisorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80 transition-opacity mb-2"
                title="View on TripAdvisor"
            >
                <BubbleRating />
            </a>

            <h4 className="font-semibold text-gray-800 mb-2 text-sm">{review.title}</h4>

            <div className="relative">
                <p 
                    ref={textRef}
                    className={classNames(
                        'text-gray-600 text-sm leading-relaxed',
                        !expanded && 'line-clamp-4'
                    )}
                >
                    {review.text}
                </p>
                {isOverflowing && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-green-700 font-medium text-sm mt-2 hover:text-green-800"
                    >
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function TripAdvisorReviews({ reviewCount = 11, badge }) {
    const reviews = [
        {
            name: 'Michael B',
            date: 'June 2025',
            title: 'Excellent real experience with great company',
            text: 'I spent a fantastic day with Lukasz and his local friends Mr Lu and Mr He - Following a scenic drive, with a lakeside stop to hang out with some yaks, and a delicious home cooked meal at Mr Lu\'s house, we set out on a trek into the hills that didn\'t disappoint, with the jewel in the crown being the end point of an open pasture with just brilliant views out over Jade Dragon Snow Mountain. Not a single person in sight and feeling at one with nature, this was exactly the experience I was hoping for and Lukasz helped deliver, with good humour, and excellent company. An experience I won\'t be forgetting and a top highlight of my three week trip to China.',
            avatar: 'M',
            image: '/images/shared/reviews/michael-b.jpg'
        },
        {
            name: 'Rapheephan R',
            date: 'May 2025',
            title: 'We are a couple from Thailand',
            text: 'Our first trip to China was a wonderful experience. The price was reasonable, the accommodations were comfortable, and having a car to take us around made everything unforgettable. A big thank you to Lynne for helping us with everything we needed — truly superb.',
            avatar: 'R',
            image: '/images/shared/reviews/rapheephan-r.png'
        },
        {
            name: 'Shirley O',
            date: 'April 2025',
            title: 'Amazing',
            text: 'We had the great pleasure of experiencing this tour with Lukasz and Lynne in early Spring. It was rather cold but very worth while. Amazing views of the countryside villages and neatly tilled fields. We did some birdwatching from the lakeside and viewed yaks and goats grazing on the slopes above. We had a delicious lunch at one of the villages. (All food in Yunnan was delicious) It was exciting to have this opportunity to explore this unique off the beaten track area with such helpful and knowledgeable guides.',
            avatar: 'S',
            image: '/images/shared/reviews/shirley-o.jpg'
        },
        {
            name: 'Paradise57589505611',
            date: 'November 2025',
            title: 'Local, genuine and ethical experience in Lijiang',
            text: 'My wife and I had the pleasure of being guided by Lynne and Lukas in the best of authentic Lijiang. Local, genuine culture meeting local villagers, walk in natural hills, guided walk through Lijiang\'s amazing streets and markets with everything covered and no hidden (negative) surprises or cost. All this while having meaningful and informed discussions. Thoroughly recommend this for anybody who want to experience the real Lijiang while making a positive impact as eco tourist.',
            avatar: 'P',
            image: '/images/shared/reviews/paradise.jpg'
        },
        {
            name: 'Sven',
            date: 'August 2025',
            title: 'Fantastic Experience with Cloud Mountain Eco Tours',
            text: 'We had an unforgettable time with Cloud Mountain Eco Tours, thanks to our amazing guide Lukas. He was incredibly friendly and connected with the kids right away. Lukas has a wonderful way of explaining things to children and made the whole experience exciting and engaging for all of us. The highlight was definitely seeing the monkeys up close and enjoying a warm, authentic dinner with a local family. Lukas is incredibly knowledgeable about the local nature. A truly special adventure for families. Highly recommended!',
            avatar: 'S',
            image: '/images/shared/reviews/sven.jpg'
        },
      {
            name: 'James O',
            date: 'March 2025',
            title: 'Magical landscape of Jade Dragon Snow Mountain',
            text: 'Really awesome and memorable day out in some magical landscapes around the foothills of Jade Dragon Snow mountain. It was a great opportunity to take my parents and a friend visiting from NZ to see some of the natural beauty of Yunnan, as well as some ethnic diversity. I absolutely love the aesthetic and charm of the villages. It was a rather cold day in March, but that seemed to add to the mystique of the landscape. Lukas and Lynne are great hosts, with an intimate knowledge of the places, people and biodiversity. Highly recommended! The meals with the locals were also incredible.',
            avatar: 'J',
            image: '/images/shared/reviews/james-o.jpg'
        },
        {
            name: 'John M',
            date: 'June 2024',
            title: 'We saw the beautiful snub nosed monkey',
            text: 'Lukas is the man, his seemly endless knowledge and enthusiasm for nature is amazing. It was a privilege to have him share his love of this wonderful part of the world with us. Thank you Lukas',
            avatar: 'J',
            image: '/images/shared/reviews/john-m.jpg'
        },
        {
            name: 'Lisa_in_Lijiang',
            date: 'May 2024',
            title: 'Unforgettable experience with wonderful people',
            text: 'I had the pleasure of participating on a trip with Lukas as part of a student group. We had an unforgettable experience getting up close to the endangered Yunnan snub-nosed monkey, hiking through pristine forests, and eating home-cooked meals with local families. Lukas and Lynne are wonderful guides with extensive knowledge about the region\'s culture, history and wildlife. I highly recommend Cloud Mountain, especially if you like traveling at your own pace, going off the beaten path, and getting an authentic, personalized experience.',
            avatar: 'L',
            image: '/images/shared/reviews/lisa.jpg'
        },
        {
            name: 'J M',
            date: 'May 2024',
            title: 'The real deal',
            text: 'It\'s an experience on a completely different level than anything that you\'d be able to put together on your own, and so worth it! The views are simply breathtaking, the trail is totally manageable and the best part is the company. Lukas has so much knowledge about Yunnan, its people and nature, he feels at home there and makes you feel the same too. If you have a chance to make this trip, do it. We\'ve been all around Yunnan and this trip is ontop of our list!',
            avatar: 'J',
            image: '/images/shared/reviews/j-m.jpg'
        },
        {
            name: 'Internationalbabe001',
            date: 'February 2025',
            title: 'Meeting the endangered black-snub nosed monkeys',
            text: 'I went on a solo trip in February arranged by my guide, Lukas, a Biologist/Conservationist into the Baima Snow Mountain National Park. With his vast knowledge of the local area, he took me first to the Lashi Wetlands and spotted over a dozen species of birds. Finally, made it to Tacheng, a reserve within Baima Snow Mountain where we spent a night in a cozy log cabin. The next morning, after a simple breakfast we went up to 3,000 metres and finally glimpsed the incredible endangered Black Snub-Nosed Monkeys. It was an amazing trip!',
            avatar: 'I',
            image: '/images/shared/reviews/internationalbabe.jpg'
        },
        {
            name: 'Hollie C',
            date: 'March 2025',
            title: 'Unforgettable',
            text: 'We took a one-day tour with Lukas to explore a few places in Lijiang, and it was truly an unforgettable experience. From the start, Lukas was incredibly thoughtful in tailoring the tour to suit our preferences and needs. One of the highlights was having lunch at a local family\'s home. After lunch, we went on a hike in the mountains, where we had the chance to enjoy some fresh air and a truly breathtaking view. The landscape was absolutely stunning. We would highly recommend this tour to anyone visiting Lijiang!',
            avatar: 'H',
            image: '/images/shared/reviews/hollie-c.jpg'
        }
    ];

    const scrollRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const [isPaused, setIsPaused] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [cardWidth, setCardWidth] = React.useState(CARD_WIDTH_MOBILE);
    const [cardMargin, setCardMargin] = React.useState(CARD_MARGIN_MOBILE);
    const [isMobile, setIsMobile] = React.useState(true);
    
    const totalCards = reviews.length;

    // Handle responsive card sizing
    React.useEffect(() => {
        const updateCardSize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                // Mobile: use percentage width
                const mobileCardWidth = Math.min(width * 0.85, 320);
                setCardWidth(mobileCardWidth);
                setCardMargin(CARD_MARGIN_MOBILE);
                setIsMobile(true);
            } else {
                // Tablet/Desktop
                setCardWidth(CARD_WIDTH);
                setCardMargin(CARD_MARGIN);
                setIsMobile(false);
            }
        };
        
        updateCardSize();
        window.addEventListener('resize', updateCardSize);
        return () => window.removeEventListener('resize', updateCardSize);
    }, []);

    const scrollAmount = cardWidth + (cardMargin * 2);
    const originalSetEnd = totalCards * scrollAmount;
    const isTransitioning = React.useRef(false);

    // Reset scroll when card size changes
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = 0;
            setCurrentIndex(0);
        }
    }, [cardWidth]);

    // Auto-scroll effect - scrolls every 4 seconds, loops infinitely
    React.useEffect(() => {
        if (isPaused || isMobile) return;
        
        const interval = setInterval(() => {
            if (scrollRef.current && !isTransitioning.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const maxScroll = scrollWidth - clientWidth;
                const singleCardScroll = scrollAmount;
                
                // Calculate next position
                let nextPosition = scrollLeft + singleCardScroll;
                
                // Stop at the last card (no loop without duplicates)
                if (nextPosition >= maxScroll) {
                    nextPosition = maxScroll;
                }
                
                // Scroll to next position
                scrollRef.current.scrollTo({
                    left: nextPosition,
                    behavior: 'smooth'
                });
            }
        }, 4000); // Scroll every 4 seconds
        
        return () => clearInterval(interval);
    }, [isPaused, isMobile, scrollAmount, totalCards]);

    // Update dot indicator
    React.useEffect(() => {
        if (!scrollRef.current) return;
        
        const handleScroll = () => {
            if (scrollRef.current) {
                const scrollLeft = scrollRef.current.scrollLeft;
                let cardIndex = Math.round(scrollLeft / scrollAmount);
                
                // Cap at the last card (no duplicates = no wrap-around needed)
                if (cardIndex >= totalCards) {
                    cardIndex = totalCards - 1;
                }
                
                setCurrentIndex(cardIndex);
            }
        };

        const scrollContainer = scrollRef.current;
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, [scrollAmount, totalCards]);

    const handleDotClick = (index) => {
        if (scrollRef.current) {
            const newPosition = index * scrollAmount;
            scrollRef.current.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            });
            setCurrentIndex(index);
        }
    };

    const handleScrollLeft = () => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current;
            let newPosition;
            
            // NO loop - just stop at first card
            if (scrollLeft <= scrollAmount) {
                newPosition = 0;
            } else {
                newPosition = scrollLeft - scrollAmount;
            }
            
            scrollRef.current.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleScrollRight = () => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current;
            const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
            let newPosition;
            
            // NO loop - just stop at last card
            if (scrollLeft >= maxScroll - scrollAmount) {
                newPosition = maxScroll;
            } else {
                newPosition = scrollLeft + scrollAmount;
            }
            
            scrollRef.current.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full py-8 md:py-12 px-2 md:px-4">
            {/* Badge */}
            {badge?.label && (
                <div className="text-center mb-4">
                    <span className="inline-block uppercase tracking-wider font-bold text-[#5ebb46] text-xs md:text-sm px-3 py-1">
                        {badge.label}
                    </span>
                </div>
            )}

            {/* Section Title */}
            <h2 className="sb-component sb-component-title text-dark text-center text-2xl sm:text-3xl mb-6 md:mb-8">
                What Our Customers Say
            </h2>

            {/* Header with Logo */}
            <div className="text-center mb-0">
                <a 
                    href="https://www.tripadvisor.com/Attraction_Review-g303783-d17638375-Reviews-Lijiang_Cloud_Mountain_Ecotours-Lijiang_Yunnan.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                >
                    <img 
                        src="/images/shared/trust/tripadvisor-logo.webp" 
                        alt="TripAdvisor" 
                        className="h-14 md:h-20 w-auto mx-auto"
                    />
                </a>
            </div>

            {/* Carousel Container with Arrows */}
            <div 
                ref={containerRef}
                className="flex items-center justify-center gap-2 md:gap-4 mx-auto py-4 md:py-5" 
                style={{ maxWidth: isMobile ? '100%' : '1070px' }}
            >
                {/* Left Arrow - hidden on mobile */}
                <button
                    onClick={handleScrollLeft}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="hidden md:flex flex-shrink-0 w-10 h-10 md:w-12 md:h-12 items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-1000"
                    aria-label="Scroll left"
                >
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Scrolling Reviews Track - with duplicates for infinite loop */}
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto flex-1 py-4 snap-x snap-mandatory"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    style={{ 
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none',
                        transitionDuration: '2500ms',
                        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    {/* Reviews - no duplicates */}
                    {reviews.map((review, index) => (
                        <ReviewCard 
                            key={`review-${index}`} 
                            review={review} 
                            cardWidth={cardWidth}
                            cardMargin={cardMargin}
                        />
                    ))}
                </div>

                {/* Right Arrow - hidden on mobile */}
                <button
                    onClick={handleScrollRight}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="hidden md:flex flex-shrink-0 w-10 h-10 md:w-12 md:h-12 items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-1000"
                    aria-label="Scroll right"
                >
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Swipe hint for mobile */}
            {isMobile && (
                <p className="text-center text-xs text-gray-400 mb-2">
                    Swipe to see more reviews
                </p>
            )}

            {/* Dots Indicator - only 9 dots for visible reviews */}
            <div className="flex justify-center gap-2 mt-2">
                {reviews.slice(0, 9).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-2.5 rounded-full transition-all duration-700 ${
                            index === currentIndex 
                                ? 'bg-green-700 w-6' 
                                : 'bg-gray-300 hover:bg-gray-400 w-2.5'
                        }`}
                        aria-label={`Go to review ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
