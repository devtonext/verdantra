// ============================================================================
// BEGINNER-FRIENDLY ADMIN DASHBOARD SCHEMA
// Every section is organized serial-by-serial (Grid 1, Grid 2, Card 1, Card 2...)
// in the exact top-to-bottom, left-to-right order shown on the website.
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
        title: 'Section 1: Hero Banner (2-Grid Split Layout)',
        description: 'The main top section of the homepage, split into Grid 1 (Left Neon-Lime Card) and Grid 2 (Right Landscape Photo & Cutout Cards).',
        fields: [
          // GRID 1: LEFT NEON-LIME CARD
          { group: 'Grid 1 — Left Neon-Lime Card (Top Badge & Main Headline)', name: 'eyebrow', label: '1. Top Small Badge Text (next to sun icon)', type: 'text', hint: 'Appears at the very top of the left neon-lime box (e.g. "Verdantra Group").' },
          { group: 'Grid 1 — Left Neon-Lime Card (Top Badge & Main Headline)', name: 'headline_line_1_left', label: '2. Headline Line 1 — First Word (before arrow circle)', type: 'text', hint: 'Word to the left of the dashed ↗ circle (e.g. "Saving").' },
          { group: 'Grid 1 — Left Neon-Lime Card (Top Badge & Main Headline)', name: 'headline_line_1_right', label: '3. Headline Line 1 — Second Part (after arrow circle)', type: 'text', hint: 'Words to the right of the dashed ↗ circle (e.g. "Nature &").' },
          { group: 'Grid 1 — Left Neon-Lime Card (Top Badge & Main Headline)', name: 'headline_line_2_left', label: '4. Headline Line 2 — First Word', type: 'text', hint: 'First word on the second line (e.g. "Fighting").' },
          { group: 'Grid 1 — Left Neon-Lime Card (Top Badge & Main Headline)', name: 'headline_line_2_underline', label: '5. Headline Line 2 — Underlined Word', type: 'text', hint: 'Underlined keyword on the second line (e.g. "Climate").' },
          { group: 'Grid 1 — Left Neon-Lime Card (Top Badge & Main Headline)', name: 'headline_line_3', label: '6. Headline Line 3 — Final Line', type: 'text', hint: 'Bottom line of the main heading (e.g. "Change Together.").' },

          // GRID 1: EMAIL FORM & MEMBERS COUNTER
          { group: 'Grid 1 — Left Neon-Lime Card (Email Signup & Members Counter)', name: 'input_placeholder', label: '7. Email Box Placeholder Text', type: 'text', hint: 'Hint text inside the email input box.' },
          { group: 'Grid 1 — Left Neon-Lime Card (Email Signup & Members Counter)', name: 'subscribe_button_text', label: '8. Subscribe Button Text', type: 'text', hint: 'Text inside the white pill button next to the email input.' },
          { group: 'Grid 1 — Left Neon-Lime Card (Email Signup & Members Counter)', name: 'members_count_label', label: '9. Bottom Members Counter Text', type: 'title', hint: 'Shown next to the 3 small circular member photos at the bottom of Grid 1.' },

          // GRID 2: RIGHT PHOTO & TOP-LEFT VOLUNTEER CUTOUT
          { group: 'Grid 2 — Right Landscape Card (Main Background & Top-Left Volunteer Box)', name: 'hero_image', label: '10. Right Grid Main Landscape Photo', type: 'image', hint: 'Full background photo for the right side of the hero section.' },
          { group: 'Grid 2 — Right Landscape Card (Main Background & Top-Left Volunteer Box)', name: 'volunteer_card_image', label: '11. Top-Left Volunteer Portrait Photo', type: 'image', hint: 'Square portrait photo inside the white top-left cutout card.' },
          { group: 'Grid 2 — Right Landscape Card (Main Background & Top-Left Volunteer Box)', name: 'volunteer_card_title', label: '12. Top-Left Volunteer Card Title', type: 'title', hint: 'Text inside the top-left white card (e.g. "We & Our Volunteers").' },
          { group: 'Grid 2 — Right Landscape Card (Main Background & Top-Left Volunteer Box)', name: 'volunteer_card_link', label: '13. Top-Left Volunteer Card Click Link', type: 'url', hint: 'Page to open when visitors click the top-left volunteer card (e.g. "/mission").' },

          // GRID 2: 3 FLOATING HOTSPOT PINS ON THE PHOTO
          { group: 'Grid 2 — Right Landscape Card (3 Floating Hotspot Pins on Photo)', name: 'pin_1_label', label: '14. Hotspot Pin 1 Text (Left Pin)', type: 'text', hint: 'First floating tag over the landscape photo (e.g. "Ocean Pollution").' },
          { group: 'Grid 2 — Right Landscape Card (3 Floating Hotspot Pins on Photo)', name: 'pin_2_label', label: '15. Hotspot Pin 2 Text (Top-Right Pin)', type: 'text', hint: 'Second floating tag over the mountain ridge (e.g. "GHG Emissions").' },
          { group: 'Grid 2 — Right Landscape Card (3 Floating Hotspot Pins on Photo)', name: 'pin_3_label', label: '16. Hotspot Pin 3 Text (Lower-Right Pin)', type: 'text', hint: 'Third floating tag over the salt flat (e.g. "Glacier Melting").' },

          // GRID 2: BOTTOM CUTOUT BADGES & SOCIAL TEXT
          { group: 'Grid 2 — Right Landscape Card (Bottom Cutout Badges & Social Row)', name: 'bottom_badge_avatar', label: '17. Bottom Ticket Badge Avatar Photo', type: 'image', hint: 'Small circular photo on top of the bottom-left white ticket badge.' },
          { group: 'Grid 2 — Right Landscape Card (Bottom Cutout Badges & Social Row)', name: 'bottom_badge_text', label: '18. Bottom Ticket Badge Text', type: 'title', hint: 'Text inside the floating bottom-left white ticket badge.' },
          { group: 'Grid 2 — Right Landscape Card (Bottom Cutout Badges & Social Row)', name: 'social_prompt_text', label: '19. Social Icons Label', type: 'text', hint: 'Text next to the IG and Facebook circular icons.' },
          { group: 'Grid 2 — Right Landscape Card (Bottom Cutout Badges & Social Row)', name: 'right_corner_summary', label: '20. Bottom-Right White Cutout Summary Text', type: 'title', hint: 'Two-line summary text inside the bottom-right white corner cutout.' }
        ]
      },
      {
        key: 'home_mission',
        title: 'Section 2: Centered Mission Statement & 4 Floating Circle Photos',
        description: 'Centered heading and buttons surrounded by 4 small circular nature photos.',
        fields: [
          { group: 'Step 1 — Centered Heading, Subtitle & Buttons', name: 'heading', label: '1. Main Centered Heading', type: 'title', hint: 'Large centered statement (press Enter for a new line).' },
          { group: 'Step 1 — Centered Heading, Subtitle & Buttons', name: 'subtitle', label: '2. Centered Subtitle Paragraph', type: 'title', hint: 'Smaller two-line explanation below the heading.' },
          { group: 'Step 1 — Centered Heading, Subtitle & Buttons', name: 'primary_cta_label', label: '3. Left Button Text', type: 'text', hint: 'Text on the outlined pill button (e.g. "View Projects").' },
          { group: 'Step 1 — Centered Heading, Subtitle & Buttons', name: 'primary_cta_link', label: '4. Left Button Link', type: 'url', hint: 'Where the left button goes (e.g. "/projects").' },
          { group: 'Step 1 — Centered Heading, Subtitle & Buttons', name: 'secondary_cta_label', label: '5. Right Link Text', type: 'text', hint: 'Text next to the neon-lime dot (e.g. "Learn More").' },
          { group: 'Step 2 — 4 Surrounding Circular Nature Photos (Left to Right)', name: 'vignette_1_image', label: '6. Top-Left Circle Photo', type: 'image', hint: 'First floating circular image on the upper left.' },
          { group: 'Step 2 — 4 Surrounding Circular Nature Photos (Left to Right)', name: 'vignette_2_image', label: '7. Bottom-Left Circle Photo', type: 'image', hint: 'Second floating circular image on the lower left.' },
          { group: 'Step 2 — 4 Surrounding Circular Nature Photos (Left to Right)', name: 'vignette_3_image', label: '8. Top-Right Circle Photo', type: 'image', hint: 'Third floating circular image on the upper right.' },
          { group: 'Step 2 — 4 Surrounding Circular Nature Photos (Left to Right)', name: 'vignette_4_image', label: '9. Bottom-Right Circle Photo', type: 'image', hint: 'Fourth floating circular image on the lower right.' }
        ]
      },
      {
        key: 'home_pillars',
        title: 'Section 3: 4-Pill Horizontal Banner (Pill 1 → Pill 2 → Pill 3 → Pill 4)',
        description: 'Four rounded stadium pills arranged side-by-side in a row ("We · Protect · [→] · Nature").',
        fields: [
          { group: 'Pill 1 & Pill 2 (Left Two Pills)', name: 'pill_1_text', label: '1. Pill 1 Text (Grey Pill)', type: 'text', hint: 'Word inside the first light-grey pill (e.g. "We").' },
          { group: 'Pill 1 & Pill 2 (Left Two Pills)', name: 'pill_2_text', label: '2. Pill 2 Text (Photo Pill)', type: 'text', hint: 'Word inside the second pill (e.g. "Protect").' },
          { group: 'Pill 1 & Pill 2 (Left Two Pills)', name: 'pill_2_image', label: '3. Pill 2 Background Photo', type: 'image', hint: 'Photo behind Pill 2 (e.g. glacier ice).' },
          { group: 'Pill 3 & Pill 4 (Right Two Pills)', name: 'pill_3_link', label: '4. Pill 3 Neon-Lime Arrow Click Link', type: 'url', hint: 'Page opened when clicking the 3rd neon-lime arrow pill (e.g. "/mission").' },
          { group: 'Pill 3 & Pill 4 (Right Two Pills)', name: 'pill_4_text', label: '5. Pill 4 Text (Photo Pill)', type: 'text', hint: 'Word inside the fourth pill (e.g. "Nature").' },
          { group: 'Pill 3 & Pill 4 (Right Two Pills)', name: 'pill_4_image', label: '6. Pill 4 Background Photo', type: 'image', hint: 'Photo behind Pill 4 (e.g. red canyon ridge).' }
        ]
      },
      {
        key: 'home_initiatives',
        title: 'Section 4: "Our Initiatives for 2026" Table Header',
        description: 'Title, right caption, and column names above the interactive initiatives rows (edit the rows themselves in Collections → Annual Initiatives).',
        fields: [
          { group: 'Step 1 — Section Title & Right Description', name: 'heading', label: '1. Left Section Title', type: 'text', hint: 'Main heading on the left (e.g. "Our initiatives for 2026").' },
          { group: 'Step 1 — Section Title & Right Description', name: 'subtitle', label: '2. Right Small Description', type: 'title', hint: 'Two-line caption on the right side of the heading.' },
          { group: 'Step 2 — Table Column Headers (Left to Right)', name: 'col_title_label', label: '3. Column 1 Name', type: 'text', hint: 'First column header (e.g. "Title").' },
          { group: 'Step 2 — Table Column Headers (Left to Right)', name: 'col_tags_label', label: '4. Column 2 Name', type: 'text', hint: 'Second column header (e.g. "Tags").' },
          { group: 'Step 2 — Table Column Headers (Left to Right)', name: 'col_date_label', label: '5. Column 3 Name', type: 'text', hint: 'Third column header (e.g. "Date").' }
        ]
      },
      {
        key: 'home_problems',
        title: 'Section 5: 4 Vertical Ecological Problem Cards Settings',
        description: 'Button label for the 4 tall problem cards (edit individual cards in Collections → Ecological Problems).',
        fields: [
          { group: 'Step 1 — Card Button Label', name: 'section_eyebrow', label: '1. Section Badge', type: 'text', hint: 'Internal label for this section.' },
          { group: 'Step 1 — Card Button Label', name: 'section_heading', label: '2. Section Heading', type: 'text', hint: 'Heading label for this section.' },
          { group: 'Step 1 — Card Button Label', name: 'explore_button_label', label: '3. Bottom White Button Text on Each Card', type: 'text', hint: 'Text inside the bottom white pill button on all 4 cards (e.g. "EXPLORE PROBLEM").' }
        ]
      },
      {
        key: 'home_impact',
        title: 'Section 6: Impact Telemetry Counters & Active Field Projects',
        description: 'Header above the 4 impact counter boxes and the 3 filterable project cards.',
        fields: [
          { group: 'Grid 1 — Top Impact Counters Header', name: 'eyebrow', label: '1. Top Small Pill Badge', type: 'text', hint: 'Badge above the impact heading (e.g. "Verified Telemetry & Field Results").' },
          { group: 'Grid 1 — Top Impact Counters Header', name: 'heading', label: '2. Main Impact Section Heading', type: 'title', hint: 'Large title on the left.' },
          { group: 'Grid 1 — Top Impact Counters Header', name: 'subtitle', label: '3. Right Supporting Explanation', type: 'textarea', hint: 'Short paragraph on the right side of the header.' },
          { group: 'Grid 2 — Active Field Projects Sub-Section', name: 'projects_heading', label: '4. Field Projects Row Title', type: 'text', hint: 'Subheading next to the category filter buttons.' },
          { group: 'Grid 2 — Active Field Projects Sub-Section', name: 'projects_cta_label', label: '5. Bottom "View All" Button Text', type: 'text', hint: 'Button below the 3 project cards.' }
        ]
      },
      {
        key: 'home_voices',
        title: 'Section 7: Frontline Voices Slider & Research Partners',
        description: 'Heading and partner bar caption for the community testimonials section.',
        fields: [
          { group: 'Step 1 — Section Header & Partner Bar Caption', name: 'eyebrow', label: '1. Top Small Pill Badge', type: 'text', hint: 'Badge above the voices heading (e.g. "Frontline Coalition").' },
          { group: 'Step 1 — Section Header & Partner Bar Caption', name: 'heading', label: '2. Section Heading', type: 'title', hint: 'Main title above the split photo & quote box.' },
          { group: 'Step 1 — Section Header & Partner Bar Caption', name: 'partners_label', label: '3. Bottom Partner Strip Label', type: 'text', hint: 'Text on the left of the institutional partner pills.' }
        ]
      },
      {
        key: 'home_faq',
        title: 'Section 8: FAQ Accordion & Expedition Callout (2-Grid Split)',
        description: 'Split into the top section header and Grid 1 (Left Neon-Lime Callout Box); Grid 2 displays your FAQs collection.',
        fields: [
          { group: 'Step 1 — Top Section Header', name: 'eyebrow', label: '1. Top Small Pill Badge', type: 'text', hint: 'Badge above the FAQ heading.' },
          { group: 'Step 1 — Top Section Header', name: 'heading', label: '2. Main Section Heading', type: 'title', hint: 'Title above the 2-column FAQ layout.' },
          { group: 'Grid 1 — Left Neon-Lime Callout Box', name: 'callout_title', label: '3. Left Box Heading', type: 'text', hint: 'Bold title inside the left neon-lime card.' },
          { group: 'Grid 1 — Left Neon-Lime Callout Box', name: 'callout_body', label: '4. Left Box Description', type: 'textarea', hint: 'Paragraph inside the left neon-lime card.' },
          { group: 'Grid 1 — Left Neon-Lime Callout Box', name: 'callout_primary_label', label: '5. Left Button 1 Text (White Pill)', type: 'text', hint: 'First button inside the callout box.' },
          { group: 'Grid 1 — Left Neon-Lime Callout Box', name: 'callout_secondary_label', label: '6. Left Button 2 Text (Outlined Pill)', type: 'text', hint: 'Second button inside the callout box.' }
        ]
      },
      {
        key: 'home_newsletter',
        title: 'Section 9: Footer Newsletter & Footer Menu Headings',
        description: 'Controls the bottom newsletter banner and the column titles of the footer navigation menus.',
        fields: [
          { group: 'Row 1 — Newsletter Signup Banner', name: 'badge_label', label: '1. Left Pill Badge Text', type: 'text', hint: 'Small outlined pill on the left (e.g. "newsletter").' },
          { group: 'Row 1 — Newsletter Signup Banner', name: 'heading', label: '2. Newsletter Headline', type: 'title', hint: 'Main callout above the email input.' },
          { group: 'Row 1 — Newsletter Signup Banner', name: 'input_placeholder', label: '3. Email Box Placeholder', type: 'text', hint: 'Placeholder inside the footer email box.' },
          { group: 'Row 1 — Newsletter Signup Banner', name: 'button_label', label: '4. Subscribe Button Text', type: 'text', hint: 'Submit button text.' },
          { group: 'Row 2 — Footer Navigation Menu Column Titles', name: 'menu_col_1_title', label: '5. Menu Column 1 Heading', type: 'text', hint: 'Heading above the main page links (e.g. "Navigation").' },
          { group: 'Row 2 — Footer Navigation Menu Column Titles', name: 'menu_col_2_title', label: '6. Menu Column 2 Heading', type: 'text', hint: 'Heading above the problem links (e.g. "Ecological Frontlines").' },
          { group: 'Row 2 — Footer Navigation Menu Column Titles', name: 'menu_col_3_title', label: '7. Menu Column 3 Heading', type: 'text', hint: 'Heading above the project links (e.g. "Field Expeditions").' }
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
        title: 'Contribution & Volunteering Page (2-Grid Top Banner & Form Tabs)',
        description: 'Organized into Grid 1 (Left Headline), Grid 2 (Right Impact Estimator), and Step 3 (Form Tab Headings).',
        fields: [
          { group: 'Grid 1 — Left Page Header', name: 'eyebrow', label: '1. Top Neon-Lime Badge', type: 'text', hint: 'Small pill above the page title.' },
          { group: 'Grid 1 — Left Page Header', name: 'heading', label: '2. Main Page Title', type: 'title', hint: 'Large heading on the left.' },
          { group: 'Grid 1 — Left Page Header', name: 'subtitle', label: '3. Supporting Paragraph', type: 'textarea', hint: 'Description below the title.' },
          { group: 'Grid 2 — Right Interactive Impact Calculator Box', name: 'calculator_heading', label: '4. Calculator Box Title', type: 'text', hint: 'Title inside the white impact estimator box.' },
          { group: 'Grid 2 — Right Interactive Impact Calculator Box', name: 'calculator_note', label: '5. Stewardship Tiers Guarantee Note', type: 'textarea', hint: 'Note shown above the 3 pricing tier cards.' },
          { group: 'Step 3 — Contribution & Volunteer Form Tab Titles', name: 'donation_form_heading', label: '6. Tab 1 Title (Donation Form)', type: 'text', hint: 'Heading for the donation pledge tab.' },
          { group: 'Step 3 — Contribution & Volunteer Form Tab Titles', name: 'volunteer_form_heading', label: '7. Tab 2 Title (Volunteer Form)', type: 'text', hint: 'Heading for the field volunteering application tab.' }
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
        title: 'Our Mission Page (Top 2-Grid Banner & Neon-Lime Manifesto)',
        description: 'Organized into Grid 1 (Left Title), Grid 2 (Right Banner Photo), and Section 2 (Manifesto Box).',
        fields: [
          { group: 'Grid 1 & Grid 2 — Top Hero Banner', name: 'eyebrow', label: '1. Top Small Badge', type: 'text', hint: 'Pill badge at the top left.' },
          { group: 'Grid 1 & Grid 2 — Top Hero Banner', name: 'heading', label: '2. Main Page Heading', type: 'title', hint: 'Large title on the left.' },
          { group: 'Grid 1 & Grid 2 — Top Hero Banner', name: 'subtitle', label: '3. Subtitle Paragraph', type: 'textarea', hint: 'Introductory copy below the heading.' },
          { group: 'Grid 1 & Grid 2 — Top Hero Banner', name: 'banner_image', label: '4. Right Grid Banner Photo', type: 'image', hint: 'Photo displayed on the right side of the mission banner.' },
          { group: 'Section 2 — Neon-Lime Manifesto Callout Box', name: 'manifesto_title', label: '5. Manifesto Left Heading', type: 'text', hint: 'Bold heading on the left of the neon-lime box.' },
          { group: 'Section 2 — Neon-Lime Manifesto Callout Box', name: 'manifesto_body', label: '6. Manifesto Right Paragraph', type: 'textarea', hint: 'Detailed mission text on the right of the neon-lime box.' }
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
        title: 'Ecological Problems Page Header',
        description: 'Top banner text above the 4 crisis selector tabs (edit individual crises in Collections → Ecological Problems).',
        fields: [
          { group: 'Step 1 — Top Banner Text', name: 'eyebrow', label: '1. Top Pill Badge', type: 'text', hint: 'Small badge above the title.' },
          { group: 'Step 1 — Top Banner Text', name: 'heading', label: '2. Main Page Heading', type: 'title', hint: 'Large headline for the problems page.' },
          { group: 'Step 1 — Top Banner Text', name: 'subtitle', label: '3. Subtitle Paragraph', type: 'textarea', hint: 'Supporting description below the headline.' }
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
        title: 'Field Projects Page Header',
        description: 'Top banner text above the project category filters and search bar (edit individual projects in Collections → Field Projects).',
        fields: [
          { group: 'Step 1 — Top Banner Text', name: 'eyebrow', label: '1. Top Pill Badge', type: 'text', hint: 'Small badge above the title.' },
          { group: 'Step 1 — Top Banner Text', name: 'heading', label: '2. Main Page Heading', type: 'title', hint: 'Large headline for the projects directory.' },
          { group: 'Step 1 — Top Banner Text', name: 'subtitle', label: '3. Subtitle Paragraph', type: 'textarea', hint: 'Supporting description below the headline.' }
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
        title: 'Global Settings: Brand Name, Theme Colours & Top Bar',
        description: 'Site-wide brand identity, colours, top announcement banner, and navigation labels.',
        fields: [
          { group: 'Step 1 — Brand Identity & Theme Colours', name: 'brand_name', label: '1. Website Brand Name', type: 'text', hint: 'Displayed in the center of the header and footer.' },
          { group: 'Step 1 — Brand Identity & Theme Colours', name: 'brand_group', label: '2. Organization Group Name', type: 'text', hint: 'Full group name.' },
          { group: 'Step 1 — Brand Identity & Theme Colours', name: 'primary_color', label: '3. Primary Highlight Colour (Neon Lime)', type: 'color', hint: 'Used for hero card, active pills, and primary buttons.' },
          { group: 'Step 1 — Brand Identity & Theme Colours', name: 'accent_color', label: '4. Dark Accent Colour (Obsidian)', type: 'color', hint: 'Used for headings, borders, and dark badges.' },
          { group: 'Step 2 — Top Announcement Bar', name: 'announcement_enabled', label: '5. Show Top Announcement Bar', type: 'boolean', hint: 'Turn the top dark announcement bar on or off.' },
          { group: 'Step 2 — Top Announcement Bar', name: 'announcement_text', label: '6. Announcement Message Text', type: 'text', hint: 'Message inside the top bar.' },
          { group: 'Step 2 — Top Announcement Bar', name: 'announcement_link', label: '7. Announcement Link URL', type: 'url', hint: 'Where "Join Expedition →" links to.' },
          { group: 'Step 3 — Footer Copyright & Tagline', name: 'footer_tagline', label: '8. Footer Brand Tagline', type: 'text', hint: 'Short mission sentence under the logo in the footer.' },
          { group: 'Step 3 — Footer Copyright & Tagline', name: 'footer_copyright', label: '9. Footer Copyright Notice', type: 'text', hint: 'Bottom-left copyright text.' }
        ]
      },
      {
        key: 'contact',
        title: 'Contact Page Details: Email, Phone, Address & Social Links',
        description: 'Displayed in the right column of the Contact Us page and in the footer.',
        fields: [
          { group: 'Grid 2 (Right Column) — Office & Science Desk Info', name: 'email', label: '1. Public Contact Email', type: 'text', hint: 'Displayed in the Science & Field Desk card and footer.' },
          { group: 'Grid 2 (Right Column) — Office & Science Desk Info', name: 'phone', label: '2. Phone Number', type: 'text', hint: 'Displayed below the email address.' },
          { group: 'Grid 2 (Right Column) — Office & Science Desk Info', name: 'address', label: '3. Headquarters Street Address', type: 'text', hint: 'Displayed in the Headquarters card.' },
          { group: 'Grid 2 (Right Column) — Office & Science Desk Info', name: 'hours', label: '4. Operating Hours', type: 'text', hint: 'Displayed below the address.' },
          { group: 'Step 2 — Social Network Profile Links', name: 'instagram_url', label: '5. Instagram Profile URL', type: 'url', hint: 'Link for the Instagram button.' },
          { group: 'Step 2 — Social Network Profile Links', name: 'facebook_url', label: '6. Facebook Page URL', type: 'url', hint: 'Link for the Facebook button.' },
          { group: 'Step 2 — Social Network Profile Links', name: 'twitter_url', label: '7. Twitter / X Profile URL', type: 'url', hint: 'Link for the Twitter button.' }
        ]
      },
      {
        key: 'contact_page',
        title: 'Contact Page Top Banner',
        description: 'Hero heading and subtitle on /contact.',
        fields: [
          { group: 'Step 1 — Top Banner Text', name: 'eyebrow', label: '1. Top Pill Badge', type: 'text', hint: 'Small badge above the contact heading.' },
          { group: 'Step 1 — Top Banner Text', name: 'heading', label: '2. Main Contact Heading', type: 'title', hint: 'Large title at the top of /contact.' },
          { group: 'Step 1 — Top Banner Text', name: 'subtitle', label: '3. Subtitle Paragraph', type: 'textarea', hint: 'Short intro text below the heading.' }
        ]
      },
      {
        key: 'seo',
        title: 'SEO & Social Sharing Metadata',
        description: 'Browser tab title, search engine description, and social share image.',
        fields: [
          { group: 'Step 1 — Search Engine & Social Preview', name: 'meta_title', label: '1. Default Browser Tab Title', type: 'text', hint: 'Shown in Google search results and browser tabs.' },
          { group: 'Step 1 — Search Engine & Social Preview', name: 'meta_description', label: '2. Search Engine Description', type: 'textarea', hint: '1–2 sentence summary for search engines.' },
          { group: 'Step 1 — Search Engine & Social Preview', name: 'og_image', label: '3. Social Share Preview Image', type: 'image', hint: 'Image shown when sharing your website link on social media.' }
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
      { name: 'title', label: '1. Initiative Title', type: 'text', required: true },
      { name: 'slug', label: '2. URL Slug', type: 'slug', from: 'title' },
      { name: 'tags', label: '3. Tags (comma separated)', type: 'tags' },
      { name: 'highlight_tag', label: '4. Highlight Tag in Neon Lime', type: 'boolean' },
      { name: 'event_date', label: '5. Date Display (DD/MM/YY)', type: 'text' },
      { name: 'location', label: '6. Field Location', type: 'text' },
      { name: 'participants_goal', label: '7. Volunteer Goal', type: 'number' },
      { name: 'image', label: '8. Hover Preview Photo', type: 'image' },
      { name: 'summary', label: '9. Initiative Summary', type: 'textarea' }
    ]
  },
  {
    table: 'problems',
    label: 'Ecological Problems',
    singular: 'Problem',
    primaryField: 'title',
    thumbnailField: 'image',
    fields: [
      { name: 'title', label: '1. Card Title (supports line break)', type: 'title', required: true },
      { name: 'slug', label: '2. URL Slug', type: 'slug', from: 'title' },
      { name: 'featured', label: '3. Featured (Show Top Glass Pills & Lime Arrow)', type: 'boolean' },
      { name: 'badge_1', label: '4. Top Glass Pill 1', type: 'text' },
      { name: 'badge_2', label: '5. Top Glass Pill 2', type: 'text' },
      { name: 'severity', label: '6. Severity Level', type: 'select', options: ['Critical', 'High', 'Moderate'] },
      { name: 'metric_value', label: '7. Key Metric Value', type: 'text' },
      { name: 'metric_label', label: '8. Key Metric Label', type: 'text' },
      { name: 'image', label: '9. Vertical Card Background Photo', type: 'image' },
      { name: 'summary', label: '10. Short Card Description', type: 'textarea' },
      { name: 'full_analysis', label: '11. Deep-Dive Scientific Analysis', type: 'markdown' },
      { name: 'solution_steps', label: '12. Remediation Steps (one per line)', type: 'list' }
    ]
  },
  {
    table: 'projects',
    label: 'Field Projects',
    singular: 'Project',
    primaryField: 'title',
    thumbnailField: 'image',
    fields: [
      { name: 'title', label: '1. Project Title', type: 'text', required: true },
      { name: 'slug', label: '2. URL Slug', type: 'slug', from: 'title' },
      { name: 'featured', label: '3. Featured Project', type: 'boolean' },
      { name: 'category', label: '4. Biome Category', type: 'text' },
      { name: 'status', label: '5. Status', type: 'select', options: ['Active Field Op', 'Scaling Phase', 'Completed Milestone'] },
      { name: 'location', label: '6. Geographic Basin', type: 'text' },
      { name: 'completion_pct', label: '7. Completion Percentage (0-100)', type: 'number' },
      { name: 'hectares_restored', label: '8. Hectares Restored', type: 'number' },
      { name: 'published_date', label: '9. Dispatch Date', type: 'date' },
      { name: 'image', label: '10. Cover Image', type: 'image' },
      { name: 'summary', label: '11. Card Summary', type: 'textarea' },
      { name: 'body', label: '12. Full Field Dispatch Report', type: 'markdown' }
    ]
  },
  {
    table: 'tiers',
    label: 'Contribution Tiers',
    singular: 'Tier',
    primaryField: 'name',
    fields: [
      { name: 'name', label: '1. Tier Name', type: 'text', required: true },
      { name: 'featured', label: '2. Featured Tier Badge', type: 'boolean' },
      { name: 'amount', label: '3. Amount (USD)', type: 'number' },
      { name: 'frequency', label: '4. Billing Frequency', type: 'select', options: ['monthly', 'one-time', 'annual'] },
      { name: 'impact_metric', label: '5. Impact Summary', type: 'textarea' },
      { name: 'perks', label: '6. Steward Perks (one per line)', type: 'list' }
    ]
  },
  {
    table: 'stats',
    label: 'Impact Statistics',
    singular: 'Stat',
    primaryField: 'label',
    fields: [
      { name: 'label', label: '1. Metric Label', type: 'text', required: true },
      { name: 'value', label: '2. Numeric Value', type: 'number' },
      { name: 'suffix', label: '3. Suffix (+, ha, %, tons)', type: 'text' },
      { name: 'detail', label: '4. Supporting Caption', type: 'textarea' }
    ]
  },
  {
    table: 'team',
    label: 'Science & Field Team',
    singular: 'Team Member',
    primaryField: 'name',
    thumbnailField: 'image',
    fields: [
      { name: 'name', label: '1. Full Name', type: 'text', required: true },
      { name: 'role', label: '2. Scientific Role', type: 'text' },
      { name: 'location', label: '3. Field Station', type: 'text' },
      { name: 'image', label: '4. Portrait Photo', type: 'image' },
      { name: 'bio', label: '5. Short Biography', type: 'textarea' }
    ]
  },
  {
    table: 'testimonials',
    label: 'Testimonials',
    singular: 'Testimonial',
    primaryField: 'author',
    thumbnailField: 'avatar',
    fields: [
      { name: 'author', label: '1. Author Name', type: 'text', required: true },
      { name: 'role', label: '2. Role & Community', type: 'text' },
      { name: 'quote', label: '3. Testimonial Quote', type: 'textarea' },
      { name: 'avatar', label: '4. Avatar Image', type: 'image' }
    ]
  },
  {
    table: 'faqs',
    label: 'FAQs',
    singular: 'FAQ',
    primaryField: 'question',
    fields: [
      { name: 'category', label: '1. Category', type: 'text' },
      { name: 'question', label: '2. Question', type: 'text', required: true },
      { name: 'answer', label: '3. Answer', type: 'textarea' }
    ]
  },
  {
    table: 'partners',
    label: 'Institutional Partners',
    singular: 'Partner',
    primaryField: 'name',
    fields: [
      { name: 'name', label: '1. Institution Name', type: 'text', required: true },
      { name: 'region', label: '2. Region', type: 'text' },
      { name: 'url', label: '3. Website URL', type: 'url' }
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
