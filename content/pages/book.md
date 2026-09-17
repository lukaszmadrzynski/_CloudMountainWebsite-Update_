---
type: PageLayout
title: Plan Your Yunnan EcoTour
sections:
  - type: GenericSection
    title:
      type: TitleBlock
      text: Plan Your Yunnan EcoTour
      color: text-dark
      styles:
        self:
          textAlign: center
    subtitle: ''
    text: "<div style=\"text-align: center\">Tell us about the trip you've been imagining — dates, group size, and your interests. We'll reply within 24 hours with an itinerary adjusted around the way you travel, and one all-inclusive price.</div>\n\n"
    actions: []
    media:
      type: ImageBlock
      altText: ''
    badge:
      type: Badge
      label: ''
      color: text-primary
    colors: bg-light-fg-dark
    styles:
      self:
        alignItems: center
        justifyContent: center
        flexDirection: col
        padding:
          - pt-10
          - pl-7
          - pb-2
          - pr-7
      subtitle:
        textAlign: center
  - type: GenericSection
    title:
      type: TitleBlock
      text: ''
      color: text-dark
      styles:
        self:
          textAlign: center
    subtitle: ''
    text: '<span style="font-size: 0.9em; font-style: italic; font-weight: bold; text-align: center; display: block;">We value your privacy. No information is shared with third parties.</span>'
    actions: []
    media:
      type: ImageBlock
      altText: ''
    colors: bg-light-fg-dark
    styles:
      self:
        alignItems: center
        justifyContent: center
        padding:
          - pt-5
          - pb-0
  - type: GenericSection
    title:
      type: TitleBlock
      text: ''
      color: text-dark
      styles:
        self:
          textAlign: left
    subtitle: ''
    text: ''
    actions: []
    media:
      type: FormBlock
      fields:
        - type: TextFormControl
          name: tourName
          label: EcoTour Name
          hideLabel: false
          placeholder: 'e.g., Yunnan Four Kingdoms, or describe what you are looking for'
          isRequired: false
        - type: SelectFormControl
          name: travelers
          label: Number of Travelers
          hideLabel: false
          options:
            - label: 1 person
              value: 1
            - label: 2 people
              value: 2
            - label: 3 people
              value: 3
            - label: 4 people
              value: 4
            - label: 5 people
              value: 5
            - label: 6 people
              value: 6
            - label: 7+ people (please specify in message)
              value: 7+
          isRequired: true
        - type: TextFormControl
          name: preferredDate
          label: Approximate Travel Dates
          hideLabel: false
          placeholder: 'e.g., May 2027 or June 15-22'
          isRequired: false
        - type: TextFormControl
          name: name
          label: Your Name
          hideLabel: false
          placeholder: ''
          isRequired: true
        - type: EmailFormControl
          name: email
          label: Email Address
          hideLabel: false
          placeholder: ''
          isRequired: true
        - type: TextFormControl
          name: phone
          label: Phone / WhatsApp / WeChat
          hideLabel: false
          placeholder: ''
          isRequired: false
        - type: TextareaFormControl
          name: message
          label: Additional Information
          hideLabel: false
          placeholder: "Please share any questions, special requirements, or any specific interests you have."
          isRequired: false
      submitButton:
        type: SubmitButtonFormControl
        label: Send My Trip Brief
        showIcon: false
        icon: arrowRight
        iconPosition: right
      styles:
        self:
          padding:
            - pt-0
            - pb-12
            - pl-0
            - pr-0
          justifyContent: center
          margin: auto
    badge:
      type: Badge
      label: ''
      color: text-primary
    colors: bg-light-fg-dark
    styles:
      self:
        alignItems: center
        justifyContent: center
        padding:
          - pt-10
          - pb-4
          - pl-4
          - pr-4
  - type: FeaturedItemsSection
    title:
      type: TitleBlock
      text: Prefer to Contact Us Directly?
      color: text-primary
      styles:
        self:
          textAlign: center
    subtitle: ''
    items:
      - type: FeaturedItem
        title: Lynne Lyu
        tagline: ''
        subtitle: ''
        text: |
          **Email:** [lynne@cloudmountain.top](mailto:lynne@cloudmountain.top)

          **Tel/WhatsApp/WeChat:** 0086 19813252518
        image:
          type: ImageBlock
          url: /images/shared/presets/Lynne2.webp
          altText: Lynne Lyu - Cofounder of Lijiang Cloud Mountain Education
          styles:
            self:
              borderRadius: x-large
        actions: []
        colors: bg-light-fg-dark
        styles:
          self:
            padding:
              - pt-4
              - pl-4
              - pb-4
              - pr-4
            borderRadius: x-large
            flexDirection: col
            textAlign: center
      - type: FeaturedItem
        title: Lukasz Madrzynski
        tagline: ''
        subtitle: ''
        text: |
          **Email:** [lukas@cloudmountain.top](mailto:lukas@cloudmountain.top)

          **Tel/WhatsApp/WeChat:** 0086 18687958551
        image:
          type: ImageBlock
          url: /images/shared/presets/Lukas2.webp
          altText: Lukasz Madrzynski - Cofounder of Lijiang Cloud Mountain Education
          styles:
            self:
              borderRadius: x-large
        actions: []
        colors: bg-light-fg-dark
        styles:
          self:
            padding:
              - pt-4
              - pl-4
              - pb-4
              - pr-4
            borderRadius: x-large
            flexDirection: col
            textAlign: center
    actions: []
    variant: two-col-grid
    colors: bg-neutral-fg-dark
    styles:
      self:
        padding:
          - pt-8
          - pl-8
          - pb-8
          - pr-8
        justifyContent: center
      subtitle:
        textAlign: center
  - type: DividerSection
    title: Divider
    elementId: ''
    colors: bg-neutral-fg-dark
    styles:
      self:
        padding:
          - pt-4
          - pl-4
          - pb-4
          - pr-4
  - type: GenericSection
    title:
      type: TitleBlock
      text: Follow Our Adventures
      color: text-dark
      styles:
        self:
          textAlign: center
    subtitle: ''
    text: "<div style=\"text-align: center\">Stay up-to-date on our latest ecotours and projects in Yunnan, see stunning photos and videos from our travels, and get inspired for your own adventure by following us on social media:</div>\n\n"
    actions:
      - type: Link
        label: Instagram
        altText: Instagram
        url: 'https://www.instagram.com/cloud.mountain.ecotours/'
        showIcon: true
        icon: instagram
        iconPosition: left
        style: secondary
        elementId: ''
      - type: Link
        label: LinkedIn
        altText: LinkedIn
        url: 'https://www.linkedin.com/company/cloud-mountain-sustainability/'
        showIcon: true
        icon: linkedin
        iconPosition: left
        style: secondary
        elementId: ''
    media:
      type: ImageBlock
      altText: ''
    badge:
      type: Badge
      label: ''
      color: text-primary
    colors: bg-light-fg-dark
    styles:
      self:
        alignItems: center
        justifyContent: center
        flexDirection: col
        padding:
          - pt-7
          - pb-12
          - pl-3
          - pr-3
slug: /book
isDraft: false
seo:
  type: Seo
  metaTitle: >-
    Plan Your Yunnan EcoTour | Cloud Mountain
  metaDescription: >-
    Tell us your dates, group size, and interests. We'll reply within 24 hours with a personal itinerary and an all-inclusive price.
  addTitleSuffix: true
  socialImage: /images/shared/brand/cm-social-preview.webp
  metaTags: []
---
