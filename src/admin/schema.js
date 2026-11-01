// ============================================================================
// ADMIN DASHBOARD SCHEMA: PAGES, SECTIONS, COLLECTIONS & INBOX TABLES
// ============================================================================

export const PAGES = [
  {
    id: 'home',
    label: 'Home Page',
    path: '/',
    collections: ['initiatives', 'problems', 'stats', 'projects', 'testimonials', 'partners', 'faqs'],
    sections: [
      {
        key: 'home_hero',
        title: 'Hero Bento Split Section',
        description: 'Left neon-lime headline & email signup card + right desert landscape card with floating volunteer badge and interactive pins.',
        fields: [
          { name: 'eyebrow', label: 'Top Eyebrow Badge', type: 'text' },
          { name: 'headline_line_1_left', label: 'Headline Line 1 (Before Circle)', type: 'text' },
          { name: 'headline_line_1_right', label: 'Headline Line 1 (After Circle)', type: 'text' },
          { name: 'headline_line_2_left', label: 'Headline Line 2 (Left)', type: 'text' },
          { name: 'headline_line_2_underline', label: 'Headline Line 2 (Underlined Word)', type: 'text' },
          { name: 'headline_line_3', label: 'Headline Line 3', type: 'text' },
          { name: 'input_placeholder', label: 'Email Input Placeholder', type: 'text' },
          { name: 'subscribe_button_text', label: 'Subscribe Button Label', type: 'text' },
          { name: 'members_count_label', label: 'Members Counter Caption', type: 'title' },
          { name: 'hero_image', label: 'Right Card Landscape Image', type: 'image' },
          { name: 'volunteer_card_title', label: 'Floating Volunteer Card Title', type: 'title' },
          { name: 'volunteer_card_image', label: 'Floating Volunteer Portrait', type: 'image' },
          { name: 'pin_1_label', label: 'Hotspot Pin 1 Label', type: 'text' },
          { name: 'pin_2_label', label: 'Hotspot Pin 2 Label', type: 'text' },
          { name: 'pin_3_label', label: 'Hotspot Pin 3 Label', type: 'text' },
          { name: 'bottom_badge_text', label: 'Bottom Cutout Badge Text', type: 'title' },
          { name: 'right_corner_summary', label: 'Bottom Right Mission Summary', type: 'title' }
        ]
      },
      {
        key: 'home_mission',
        title: 'Cleaner & Greener Statement Section',
        description: 'Centered callout with 4 floating circular nature vignettes.',
        fields: [
          { name: 'heading', label: 'Section Heading (supports line breaks)', type: 'title' },
          { name: 'subtitle', label: 'Subtitle Text', type: 'title' },
          { name: 'primary_cta_label', label: 'Primary Button Label', type: 'text' },
          { name: 'primary_cta_link', label: 'Primary Button Link', type: 'url' },
          { name: 'secondary_cta_label', label: 'Secondary Link Label', type: 'text' },
          { name: 'vignette_1_image', label: 'Floating Vignette 1 Image', type: 'image' },
          { name: 'vignette_2_image', label: 'Floating Vignette 2 Image', type: 'image' },
          { name: 'vignette_3_image', label: 'Floating Vignette 3 Image', type: 'image' },
          { name: 'vignette_4_image', label: 'Floating Vignette 4 Image', type: 'image' }
        ]
      },
      {
        key: 'home_pillars',
        title: '4-Pill Horizontal Strip (We · Protect · → · Nature)',
        description: 'Four rounded stadium pills displaying the core visual mantra.',
        fields: [
          { name: 'pill_1_text', label: 'Pill 1 Text', type: 'text' },
          { name: 'pill_2_text', label: 'Pill 2 Text', type: 'text' },
          { name: 'pill_2_image', label: 'Pill 2 Background Image', type: 'image' },
          { name: 'pill_3_link', label: 'Pill 3 Arrow Destination Link', type: 'url' },
          { name: 'pill_4_text', label: 'Pill 4 Text', type: 'text' },
          { name: 'pill_4_image', label: 'Pill 4 Background Image', type: 'image' }
        ]
      },
      {
        key: 'home_initiatives',
        title: 'Initiatives Table Header',
        description: 'Heading and column headers for the interactive annual initiatives list.',
        fields: [
          { name: 'heading', label: 'Section Heading', type: 'text' },
          { name: 'subtitle', label: 'Right Subtitle', type: 'title' },
          { name: 'col_title_label', label: 'Column 1 Header', type: 'text' },
          { name: 'col_tags_label', label: 'Column 2 Header', type: 'text' },
          { name: 'col_date_label', label: 'Column 3 Header', type: 'text' }
        ]
      },
      {
        key: 'home_problems',
        title: 'Ecological Problems Cards Section',
        description: 'Settings for the 4 vertical ecological catastrophe cards.',
        fields: [
          { name: 'section_eyebrow', label: 'Eyebrow Label', type: 'text' },
          { name: 'section_heading', label: 'Section Heading', type: 'text' },
          { name: 'explore_button_label', label: 'Card Bottom Button Label', type: 'text' }
        ]
      },
      {
        key: 'home_impact',
        title: 'Impact Telemetry & Active Field Projects Section',
        description: 'Animated restoration metrics band and filterable field project spotlight cards.',
        fields: [
          { name: 'eyebrow', label: 'Eyebrow Badge', type: 'text' },
          { name: 'heading', label: 'Section Heading', type: 'title' },
          { name: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
          { name: 'projects_heading', label: 'Featured Projects Subheading', type: 'text' },
          { name: 'projects_cta_label', label: 'All Projects Button Label', type: 'text' }
        ]
      },
      {
        key: 'home_voices',
        title: 'Frontline Voices & Institutional Partners Section',
        description: 'Community testimonial slider and scientific partner coalition.',
        fields: [
          { name: 'eyebrow', label: 'Eyebrow Badge', type: 'text' },
          { name: 'heading', label: 'Section Heading', type: 'title' },
          { name: 'partners_label', label: 'Partners Strip Caption', type: 'text' }
        ]
      },
      {
        key: 'home_faq',
        title: 'Homepage FAQ Accordion & Expedition Callout',
        description: 'Two-column FAQ accordion and direct contribution/volunteer callout card.',
        fields: [
          { name: 'eyebrow', label: 'Eyebrow Badge', type: 'text' },
          { name: 'heading', label: 'Section Heading', type: 'title' },
          { name: 'callout_title', label: 'Left Callout Card Title', type: 'text' },
          { name: 'callout_body', label: 'Left Callout Card Body', type: 'textarea' },
          { name: 'callout_primary_label', label: 'Primary CTA Label', type: 'text' },
          { name: 'callout_secondary_label', label: 'Secondary CTA Label', type: 'text' }
        ]
      },
      {
        key: 'home_newsletter',
        title: 'Footer Newsletter Callout',
        description: 'Bottom newsletter signup banner.',
        fields: [
          { name: 'badge_label', label: 'Left Pill Badge Text', type: 'text' },
          { name: 'heading', label: 'Newsletter Headline', type: 'title' },
          { name: 'input_placeholder', label: 'Email Input Placeholder', type: 'text' },
          { name: 'button_label', label: 'Submit Button Label', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'contribution',
    label: 'Contribution Page',
    path: '/contribution',
    collections: ['tiers', 'initiatives', 'faqs'],
    sections: [
      {
        key: 'contribution_page',
        title: 'Contribution & Volunteer Header',
        description: 'Hero copy and impact calculator labels.',
        fields: [
          { name: 'eyebrow', label: 'Eyebrow Badge', type: 'text' },
          { name: 'heading', label: 'Page Heading', type: 'title' },
          { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
          { name: 'calculator_heading', label: 'Impact Estimator Title', type: 'text' },
          { name: 'calculator_note', label: 'Allocation Guarantee Note', type: 'textarea' },
          { name: 'donation_form_heading', label: 'Donation Tab Heading', type: 'text' },
          { name: 'volunteer_form_heading', label: 'Volunteer Tab Heading', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'mission',
    label: 'Our Mission Page',
    path: '/mission',
    collections: ['stats', 'team', 'testimonials', 'partners'],
    sections: [
      {
        key: 'mission_page',
        title: 'Mission & Scientific Mandate',
        description: 'Mission statement, field manifesto, and banner photo.',
        fields: [
          { name: 'eyebrow', label: 'Eyebrow Badge', type: 'text' },
          { name: 'heading', label: 'Page Heading', type: 'title' },
          { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
          { name: 'manifesto_title', label: 'Manifesto Callout Heading', type: 'text' },
          { name: 'manifesto_body', label: 'Manifesto Body Copy', type: 'textarea' },
          { name: 'banner_image', label: 'Hero Banner Image', type: 'image' }
        ]
      }
    ]
  },
  {
    id: 'problems',
    label: 'Problems Page',
    path: '/problems',
    collections: ['problems'],
    sections: [
      {
        key: 'problems_page',
        title: 'Ecological Problems Dossier Header',
        description: 'Introductory copy for the planetary diagnostics page.',
        fields: [
          { name: 'eyebrow', label: 'Eyebrow Badge', type: 'text' },
          { name: 'heading', label: 'Page Heading', type: 'title' },
          { name: 'subtitle', label: 'Subtitle', type: 'textarea' }
        ]
      }
    ]
  },
  {
    id: 'projects',
    label: 'Projects Page',
    path: '/projects',
    collections: ['projects'],
    sections: [
      {
        key: 'projects_page',
        title: 'Field Projects Header',
        description: 'Heading and intro text for the projects directory.',
        fields: [
          { name: 'eyebrow', label: 'Eyebrow Badge', type: 'text' },
          { name: 'heading', label: 'Page Heading', type: 'title' },
          { name: 'subtitle', label: 'Subtitle', type: 'textarea' }
        ]
      }
    ]
  },
  {
    id: 'contact',
    label: 'Contact & Global Settings',
    path: '/contact',
    collections: [],
    sections: [
      {
        key: 'general',
        title: 'Brand Identity, Theme Colours & Navigation',
        description: 'Global brand name, neon-lime primary colour, accent colour, and announcement bar.',
        fields: [
          { name: 'brand_name', label: 'Brand Name', type: 'text' },
          { name: 'brand_group', label: 'Organization Group Name', type: 'text' },
          { name: 'primary_color', label: 'Primary Brand Colour (Neon Lime)', type: 'color' },
          { name: 'accent_color', label: 'Accent Colour (Obsidian Dark)', type: 'color' },
          { name: 'announcement_enabled', label: 'Show Top Announcement Bar', type: 'boolean' },
          { name: 'announcement_text', label: 'Announcement Bar Text', type: 'text' },
          { name: 'announcement_link', label: 'Announcement CTA Link', type: 'url' },
          { name: 'footer_copyright', label: 'Footer Copyright Text', type: 'text' }
        ]
      },
      {
        key: 'seo',
        title: 'SEO & OpenGraph Metadata',
        description: 'Default browser title, meta description, and social share image.',
        fields: [
          { name: 'meta_title', label: 'Default Meta Title', type: 'text' },
          { name: 'meta_description', label: 'Meta Description', type: 'textarea' },
          { name: 'og_image', label: 'OpenGraph Share Image', type: 'image' }
        ]
      },
      {
        key: 'contact',
        title: 'Contact Coordinates & Social Links',
        description: 'Email, phone, address, field hours, and social profiles.',
        fields: [
          { name: 'email', label: 'Public Contact Email', type: 'text' },
          { name: 'phone', label: 'Phone Number', type: 'text' },
          { name: 'address', label: 'Headquarters Address', type: 'text' },
          { name: 'hours', label: 'Operating Hours', type: 'text' },
          { name: 'instagram_url', label: 'Instagram URL', type: 'url' },
          { name: 'facebook_url', label: 'Facebook URL', type: 'url' },
          { name: 'twitter_url', label: 'Twitter / X URL', type: 'url' }
        ]
      },
      {
        key: 'contact_page',
        title: 'Contact Page Header',
        description: 'Hero heading and subtitle on /contact.',
        fields: [
          { name: 'eyebrow', label: 'Eyebrow Badge', type: 'text' },
          { name: 'heading', label: 'Page Heading', type: 'title' },
          { name: 'subtitle', label: 'Subtitle', type: 'textarea' }
        ]
      }
    ]
  }
];

export const COLLECTIONS = [
  {
    table: 'initiatives',
    label: 'Annual Initiatives',
    singular: 'Initiative',
    primaryField: 'title',
    thumbnailField: 'image',
    fields: [
      { name: 'title', label: 'Initiative Title', type: 'text', required: true },
      { name: 'slug', label: 'URL Slug', type: 'slug', from: 'title' },
      { name: 'tags', label: 'Tags (comma separated)', type: 'tags' },
      { name: 'highlight_tag', label: 'Highlight Tag in Neon Lime', type: 'boolean' },
      { name: 'event_date', label: 'Date Display (DD/MM/YY)', type: 'text' },
      { name: 'location', label: 'Field Location', type: 'text' },
      { name: 'participants_goal', label: 'Volunteer Goal', type: 'number' },
      { name: 'image', label: 'Hover Preview Photo', type: 'image' },
      { name: 'summary', label: 'Initiative Summary', type: 'textarea' }
    ]
  },
  {
    table: 'problems',
    label: 'Ecological Problems',
    singular: 'Problem',
    primaryField: 'title',
    thumbnailField: 'image',
    fields: [
      { name: 'title', label: 'Card Title (supports \n line break)', type: 'title', required: true },
      { name: 'slug', label: 'URL Slug', type: 'slug', from: 'title' },
      { name: 'featured', label: 'Featured (Show Top Glass Pills & Lime Arrow)', type: 'boolean' },
      { name: 'badge_1', label: 'Top Glass Pill 1', type: 'text' },
      { name: 'badge_2', label: 'Top Glass Pill 2', type: 'text' },
      { name: 'severity', label: 'Severity Level', type: 'select', options: ['Critical', 'High', 'Moderate'] },
      { name: 'metric_value', label: 'Key Metric Value', type: 'text' },
      { name: 'metric_label', label: 'Key Metric Label', type: 'text' },
      { name: 'image', label: 'Vertical Card Background Photo', type: 'image' },
      { name: 'summary', label: 'Short Card Description', type: 'textarea' },
      { name: 'full_analysis', label: 'Deep-Dive Scientific Analysis', type: 'markdown' },
      { name: 'solution_steps', label: 'Remediation Steps (one per line)', type: 'list' }
    ]
  },
  {
    table: 'projects',
    label: 'Field Projects',
    singular: 'Project',
    primaryField: 'title',
    thumbnailField: 'image',
    fields: [
      { name: 'title', label: 'Project Title', type: 'text', required: true },
      { name: 'slug', label: 'URL Slug', type: 'slug', from: 'title' },
      { name: 'featured', label: 'Featured Project', type: 'boolean' },
      { name: 'category', label: 'Biome Category', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active Field Op', 'Scaling Phase', 'Completed Milestone'] },
      { name: 'location', label: 'Geographic Basin', type: 'text' },
      { name: 'completion_pct', label: 'Completion Percentage (0-100)', type: 'number' },
      { name: 'hectares_restored', label: 'Hectares Restored', type: 'number' },
      { name: 'published_date', label: 'Dispatch Date', type: 'date' },
      { name: 'image', label: 'Cover Image', type: 'image' },
      { name: 'summary', label: 'Card Summary', type: 'textarea' },
      { name: 'body', label: 'Full Field Dispatch Report', type: 'markdown' }
    ]
  },
  {
    table: 'tiers',
    label: 'Contribution Tiers',
    singular: 'Tier',
    primaryField: 'name',
    fields: [
      { name: 'name', label: 'Tier Name', type: 'text', required: true },
      { name: 'featured', label: 'Featured Tier Badge', type: 'boolean' },
      { name: 'amount', label: 'Amount (USD)', type: 'number' },
      { name: 'frequency', label: 'Billing Frequency', type: 'select', options: ['monthly', 'one-time', 'annual'] },
      { name: 'impact_metric', label: 'Impact Summary', type: 'textarea' },
      { name: 'perks', label: 'Steward Perks (one per line)', type: 'list' }
    ]
  },
  {
    table: 'stats',
    label: 'Impact Statistics',
    singular: 'Stat',
    primaryField: 'label',
    fields: [
      { name: 'label', label: 'Metric Label', type: 'text', required: true },
      { name: 'value', label: 'Numeric Value', type: 'number' },
      { name: 'suffix', label: 'Suffix (+, ha, %, tons)', type: 'text' },
      { name: 'detail', label: 'Supporting Caption', type: 'textarea' }
    ]
  },
  {
    table: 'team',
    label: 'Science & Field Team',
    singular: 'Team Member',
    primaryField: 'name',
    thumbnailField: 'image',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'role', label: 'Scientific Role', type: 'text' },
      { name: 'location', label: 'Field Station', type: 'text' },
      { name: 'image', label: 'Portrait Photo', type: 'image' },
      { name: 'bio', label: 'Short Biography', type: 'textarea' }
    ]
  },
  {
    table: 'testimonials',
    label: 'Testimonials',
    singular: 'Testimonial',
    primaryField: 'author',
    thumbnailField: 'avatar',
    fields: [
      { name: 'author', label: 'Author Name', type: 'text', required: true },
      { name: 'role', label: 'Role & Community', type: 'text' },
      { name: 'quote', label: 'Testimonial Quote', type: 'textarea' },
      { name: 'avatar', label: 'Avatar Image', type: 'image' }
    ]
  },
  {
    table: 'faqs',
    label: 'FAQs',
    singular: 'FAQ',
    primaryField: 'question',
    fields: [
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'answer', label: 'Answer', type: 'textarea' }
    ]
  },
  {
    table: 'partners',
    label: 'Institutional Partners',
    singular: 'Partner',
    primaryField: 'name',
    fields: [
      { name: 'name', label: 'Institution Name', type: 'text', required: true },
      { name: 'region', label: 'Region', type: 'text' },
      { name: 'url', label: 'Website URL', type: 'url' }
    ]
  }
];

export const INBOX_TABLES = [
  {
    table: 'messages',
    label: 'Contact Messages',
    statuses: ['unread', 'read', 'archived'],
    primaryField: 'name',
    secondaryField: 'subject'
  },
  {
    table: 'donations',
    label: 'Contribution Pledges',
    statuses: ['pending', 'confirmed', 'archived'],
    primaryField: 'donor_name',
    secondaryField: 'tier_name'
  },
  {
    table: 'volunteers',
    label: 'Volunteer Applications',
    statuses: ['new', 'approved', 'contacted', 'archived'],
    primaryField: 'full_name',
    secondaryField: 'initiative'
  },
  {
    table: 'subscribers',
    label: 'Newsletter Subscribers',
    statuses: ['active', 'unsubscribed'],
    primaryField: 'email',
    secondaryField: 'source'
  }
];
