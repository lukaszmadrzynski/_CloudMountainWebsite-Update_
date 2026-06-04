---
title: Blog
slug: /blog
numOfPostsPerPage: 12
enableSearch: false
topSections:
  - title:
      text: Featured Posts
      color: text-dark
      type: TitleBlock
      styles:
        self:
          textAlign: left
    subtitle: Discover inspiring stories from our eco-adventures
    posts:
      - content/pages/blog/spring-wildflowers-yunnan.md
      - content/pages/blog/sustainable-lodging-yunnan.md
    showThumbnail: true
    showExcerpt: true
    showDate: true
    showAuthor: true
    variant: two-col-grid
    colors: bg-light-fg-dark
    styles:
      self:
        padding:
          - pt-10
          - pb-8
          - pl-4
          - pr-4
        justifyContent: flex-start
    type: FeaturedPostsSection
    hoverEffect: move-up
  - title:
      text: Recent Stories
      color: text-dark
      type: TitleBlock
      styles:
        self:
          textAlign: left
    subtitle: More adventures, insights, and stories from the Yunnan highlands
    recentCount: 6
    initialCount: 3
    showViewMore: true
    viewMoreText: View More
    showThumbnail: true
    showExcerpt: true
    showDate: true
    showAuthor: true
    variant: carousel
    styles:
      self:
        padding:
          - pt-8
          - pb-10
          - pl-4
          - pr-4
        justifyContent: flex-start
    type: RecentPostsSection
    hoverEffect: move-up
  - type: GenericSection
    title:
      text: Ready for Your Yunnan Adventure?
      color: text-light
      styles:
        self:
          textAlign: center
          fontWeight: 400
    subtitle: Join us in the Yunnan highlands for an unforgettable eco-experience. We offer curated ecoexperiences for individuals, families, schools, and corporate groups.
    colors: bg-dark-fg-light
    styles:
      self:
        justifyContent: center
        padding:
          - pt-16
          - pb-16
    actions:
      - type: Button
        label: Explore Our Ecotours
        altText: View our ecotour offerings
        url: /ecotours
        showIcon: false
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: ''
      - type: Button
        label: Partner With Us
        altText: Learn about partnership opportunities
        url: /partner-with-us
        showIcon: false
        icon: arrowRight
        iconPosition: right
        style: secondary
        elementId: ''
  - type: GenericSection
    title:
      type: TitleBlock
      text: Cloud Mountain
      color: text-dark
    subtitle: Your Sustainable Travel Companion
    text: >
      We are dedicated to providing exceptional travel experiences that support
      local communities and sustainable development in some of the most
      vulnerable areas of Yunnan province, China. Learn more about our mission
      and team.
    actions:
      - type: Button
        label: About Us
        url: /why-us
        icon: arrowRight
        iconPosition: right
        style: secondary
    media:
      type: ImageBlock
      url: /images/pages/home/About Us Banner OPT.webp
      altText: Cloud Mountain Ecotours and Nature Education
    badge:
      type: Badge
      label: About Us
      color: text-primary
    colors: bg-light-fg-dark
    styles:
      self:
        alignItems: center
        flexDirection: row-reverse
        padding:
          - pt-8
          - pb-8
          - pl-2
          - pr-2
        justifyContent: center
styles:
  title:
    textAlign: center

seo:
  metaTitle: Blog - Cloud Mountain Ecotours
  metaDescription: >-
    Read inspiring stories, travel insights, and eco-adventure experiences from
    the Yunnan highlands. Discover the beauty of sustainable travel.
  socialImage: /images/blog/ndex/img-placeholder.svg
  type: Seo
type: PostFeedLayout
bottomSections: []
postFeed: null
---
