---
type: PageLayout
title: Contact Us
sections:
  - type: EcotoursHeroSection
    media:
      url: /images/Contact-Us-Hero.webp
      altText: Contact Us - Cloud Mountain Team
  - type: GenericSection
    title:
      type: TitleBlock
      text: Let's Start Planning Your Yunnan Adventure!
      color: text-dark
      styles:
        self:
          textAlign: center
    subtitle: ''
    text: "<div style=\"text-align: center\">We're eager to help you design your unforgettable and responsible ecoexperience in Yunnan. <br>Contact us directly to **Book Your Private EcoTour** or to **Discuss Potential Partnership**.</div>\n\n"
    actions: []
    media:
      type: ImageBlock
      altText: Fun feature preview
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
          - pt-9
          - pl-7
          - pb-7
          - pr-7
      subtitle:
        textAlign: center
  - type: FeaturedItemsSection
    title:
      type: TitleBlock
      text: Contact Us Directly
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
          **Email:** <lynne@cloudmountain.top>

          **Tel/WhatsApp/Wechat:** 0086 19813252518
        image:
          type: ImageBlock
          url: /images/Lynne2.webp
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
        text: |+
          **Email:** [lukas@cloudmountain.top](mailto:lynne@cloudmountain.top)

          **Tel/WhatsApp/Wechat:** 0086 18687958551



        image:
          type: ImageBlock
          url: /images/Lukas2.webp
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
      text: Or Send Us a Message Here
      color: text-primary
      styles:
        self:
          textAlign: center
    subtitle: ''
    text: "<div style=\"text-align: center\">Fill out the form below and we will get back to you within 24 hours.</div>\n"
    actions: []
    media:
      type: ImageBlock
      altText: Fun feature preview
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
          - pt-6
          - pl-6
          - pb-2
          - pr-6
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
    colors: bg-light-fg-dark
    styles:
      self:
        alignItems: center
        justifyContent: center
        padding:
          - pt-4
          - pb-0
  - type: GenericSection
    title:
      type: TitleBlock
      text: ''
      color: text-dark
    subtitle: ''
    text: ''
    actions: []
    media:
      type: FormBlock
      fields:
        - name: name
          label: Name
          hideLabel: true
          placeholder: Your Name
          isRequired: true
          width: full
          type: TextFormControl
        - name: email
          label: Email
          hideLabel: true
          placeholder: Your Email
          isRequired: true
          width: full
          type: EmailFormControl
        - name: message
          label: Message
          hideLabel: true
          placeholder: Tell us about your travel plans, group size, preferred dates, and any questions you have...
          isRequired: true
          width: full
          type: TextareaFormControl
      submitButton:
        label: Send Message
        showIcon: true
        icon: send
        iconPosition: right
        style: primary
        elementId: null
        type: SubmitButtonFormControl
      elementId: contact-form
      styles:
        self:
          padding:
            - pt-4
            - pb-4
            - pl-4
            - pr-4
          borderColor: border-neutral
          borderStyle: solid
          borderWidth: 1
          borderRadius: large
          maxWidth: mx-w-xl
          margin:
            - ml-auto
            - mr-auto
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
          - pt-2
          - pb-8
          - pl-2
          - pr-2
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
    text: >+
      <div style="text-align: center">Stay up-to-date on our latest ecotours and projects in Yunnan, see stunning photos and videos from our
      travels, and get inspired for your own adventure by following us on
      social media:</div>

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
      altText: Fun feature preview
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
slug: /contact-us
isDraft: false
seo:
  type: Seo
  metaTitle: >-
    Contact Us | Cloud Mountain - Yunnan Eco-Tours, Sustainable Travel & Nature
    Education
  metaDescription: >-
    Contact Cloud Mountain, your trusted partner for sustainable Yunnan
    eco-tours! Reach Lynne & Lukasz directly via email, phone, or social media
    to plan your Lijiang & Shangri-La adventure. Follow our sustainable
    adventures on our social media.
  addTitleSuffix: true
  socialImage: /images/CM Logo Color No Text.png
  metaTags: []
---
