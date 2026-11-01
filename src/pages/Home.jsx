import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSite, usePageTitle } from '../lib/site.jsx';
import Lines from '../components/Lines.jsx';
import SmartLink from '../components/SmartLink.jsx';
import Reveal from '../components/Reveal.jsx';
import Counter from '../components/Counter.jsx';
import FAQAccordion from '../components/FAQAccordion.jsx';
import Modal from '../components/Modal.jsx';

export default function Home() {
  usePageTitle('');
  const navigate = useNavigate();
  const { content, collections, api, addToast } = useSite();

  const hero = content?.home_hero || {};
  const mission = content?.home_mission || {};
  const pillars = content?.home_pillars || {};
  const initSection = content?.home_initiatives || {};
  const probSection = content?.home_problems || {};
  const impactSection = content?.home_impact || {};
  const voicesSection = content?.home_voices || {};
  const faqSection = content?.home_faq || {};
  const contact = content?.contact || {};

  const initiatives = collections?.initiatives || [];
  const problems = collections?.problems || [];
  const stats = collections?.stats || [];
  const projects = collections?.projects || [];
  const testimonials = collections?.testimonials || [];
  const partners = collections?.partners || [];
  const faqs = collections?.faqs || [];

  const [heroEmail, setHeroEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoveredInitId, setHoveredInitId] = useState(initiatives[1]?.id || initiatives[0]?.id || null);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [homeProjectCat, setHomeProjectCat] = useState('All');
  const [voiceIndex, setVoiceIndex] = useState(0);

  const handleHeroSubscribe = async (e) => {
    e.preventDefault();
    if (!heroEmail || !heroEmail.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.submit('subscribers', { email: heroEmail.trim(), source: 'hero_form' });
      setHeroEmail('');
      addToast('Subscribed! You are now part of the Verdantra network.');
    } catch (err) {
      addToast(err.message || 'Subscription failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAmbientAudio = () => {
    setAudioPlaying((prev) => {
      const next = !prev;
      addToast(next ? 'Ambient Altiplano wind & lagoon audio enabled' : 'Ambient field audio muted');
      return next;
    });
  };

  const projectCategories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const visibleProjects = projects
    .filter((p) => homeProjectCat === 'All' || p.category === homeProjectCat)
    .slice(0, 3);
  const currentVoice = testimonials[voiceIndex % Math.max(1, testimonials.length)] || testimonials[0];

  return (
    <div>
      {/* ====================================================================
          1. DUAL BENTO HERO SECTION WITH EXACT LIQUID CUTOUT GEOMETRY
         ==================================================================== */}
      <section className="hero-bento">
        {/* Left Neon Lime Card */}
        <div className="hero-card-left">
          <div className="hero-eyebrow">
            <span aria-hidden="true">☀️</span>
            <span>{hero.eyebrow || 'Verdantra Group'}</span>
          </div>

          <h1 className="hero-display-title">
            {hero.headline_line_1_left || 'Saving'}
            <span className="hero-inline-circle" aria-hidden="true">↗</span>
            {hero.headline_line_1_right || 'Nature &'}
            <br />
            {hero.headline_line_2_left || 'Fighting'}{' '}
            <span className="hero-underline-word">
              {hero.headline_line_2_underline || 'Climate'}
            </span>
            <br />
            {hero.headline_line_3 || 'Change Together.'}
          </h1>

          <form className="hero-subscribe-form" onSubmit={handleHeroSubscribe}>
            <input
              type="email"
              required
              className="hero-subscribe-input"
              placeholder={hero.input_placeholder || 'Enter your e-mail'}
              value={heroEmail}
              onChange={(e) => setHeroEmail(e.target.value)}
              aria-label="Hero email subscription"
            />
            <button type="submit" className="hero-subscribe-btn" disabled={submitting}>
              <span>{submitting ? 'Joining…' : hero.subscribe_button_text || 'Subscribe'}</span>
              <span>→</span>
            </button>
          </form>

          <div className="hero-members-row">
            <div className="avatar-stack">
              <img src="/images/volunteer-portrait.jpg" alt="Member 1" className="avatar-stack-item" />
              <img src="/images/lagoon-mirror.jpg" alt="Member 2" className="avatar-stack-item" />
              <img src="/images/glacier-ice.jpg" alt="Member 3" className="avatar-stack-item" />
            </div>
            <div className="hero-members-text">
              <Lines text={hero.members_count_label || '1.7M+ members of our\ncharity organization'} />
            </div>
          </div>
        </div>

        {/* Right Landscape Card with Stepped & S-Curve Cutouts */}
        <div className="hero-card-right">
          <img
            src={hero.hero_image || '/images/hero-basin.jpg'}
            alt="High-altitude desert salt flat and mountain conservation basin"
            className="hero-card-right-bg"
          />

          {/* Top-Left Stepped/Notched "We & Our Volunteers" Card */}
          <SmartLink to={hero.volunteer_card_link || '/mission'} className="hero-volunteer-widget">
            <div className="hero-volunteer-card-shape">
              <svg className="hero-volunteer-svg-bg" viewBox="0 0 212 126" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 22 0 H 148 A 16 16 0 0 1 164 16 V 26 A 18 18 0 0 0 182 44 H 196 A 16 16 0 0 1 212 60 V 104 A 22 22 0 0 1 190 126 H 22 A 22 22 0 0 1 0 104 V 22 A 22 22 0 0 1 22 0 Z" fill="#ffffff" />
              </svg>
              <img
                src={hero.volunteer_card_image || '/images/volunteer-portrait.jpg'}
                alt="Field volunteer"
                className="hero-volunteer-thumb"
              />
              <div className="hero-volunteer-info">
                <span className="hero-volunteer-dot" />
                <span className="hero-volunteer-title">
                  <Lines text={hero.volunteer_card_title || 'We & Our\nVolunteers'} />
                </span>
              </div>
              <div className="hero-volunteer-step-cutout">
                <span className="hero-volunteer-arrow">↗</span>
              </div>
            </div>
          </SmartLink>

          {/* Top-Right Ambient Audio Button */}
          <button
            type="button"
            className={`hero-audio-btn ${audioPlaying ? 'playing' : ''}`}
            onClick={toggleAmbientAudio}
            aria-label="Toggle ambient nature soundscape"
            title="Toggle ambient field audio"
          >
            🎙
          </button>

          {/* Two-Part Neon-Lime Hotspot Pins (Circle Ring + Capsule Pill) */}
          <button
            type="button"
            className="hero-pin"
            style={{ left: hero.pin_1_x || '24%', top: hero.pin_1_y || '46%' }}
            onClick={() => navigate(`/problems?focus=${hero.pin_1_slug || 'ocean-pollution'}`)}
          >
            <span className="hero-pin-ring"><span className="hero-pin-dot" /></span>
            <span className="hero-pin-pill">{hero.pin_1_label || 'Ocean Pollution'}</span>
          </button>

          <button
            type="button"
            className="hero-pin"
            style={{ left: hero.pin_2_x || '76%', top: hero.pin_2_y || '39%' }}
            onClick={() => navigate(`/problems?focus=${hero.pin_2_slug || 'ghg-emissions'}`)}
          >
            <span className="hero-pin-ring"><span className="hero-pin-dot" /></span>
            <span className="hero-pin-pill">{hero.pin_2_label || 'GHG Emissions'}</span>
          </button>

          <button
            type="button"
            className="hero-pin"
            style={{ left: hero.pin_3_x || '64%', top: hero.pin_3_y || '58%' }}
            onClick={() => navigate(`/problems?focus=${hero.pin_3_slug || 'glacier-melting'}`)}
          >
            <span className="hero-pin-ring"><span className="hero-pin-dot" /></span>
            <span className="hero-pin-pill">{hero.pin_3_label || 'Glacier Melting'}</span>
          </button>

          {/* Bottom-Left S-Curve Cutout Notch with Scroll Mouse Indicator */}
          <div className="hero-left-scroll-cutout">
            <a href="#mission-statement" className="hero-scroll-notch" aria-label="Scroll down">
              <svg width="15" height="21" viewBox="0 0 16 22" fill="none">
                <rect x="1.5" y="1.5" width="13" height="19" rx="6.5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8" cy="7" r="1.5" fill="currentColor" />
              </svg>
            </a>
          </div>

          {/* Floating Bottom-Left Ticket Badge with Arched Avatar Tab & Rivet Studs */}
          <SmartLink to="/contribution?tab=volunteer" className="hero-bottom-badge">
            <span className="hero-bottom-badge-arch" />
            <span className="hero-bottom-badge-stud left" />
            <span className="hero-bottom-badge-stud right" />
            <img
              src={hero.bottom_badge_avatar || '/images/volunteer-portrait.jpg'}
              alt="Volunteer leader"
              className="hero-bottom-badge-avatar"
            />
            <div className="hero-bottom-badge-text">
              <Lines text={hero.bottom_badge_text || 'Join us in fighting\nenvironmental problems'} />
            </div>
          </SmartLink>

          {/* Neon-Lime Social Strip Above Bottom-Right Cutout */}
          <div className="hero-social-strip">
            <a
              href={contact.instagram_url || 'https://instagram.com'}
              target="_blank"
              rel="noreferrer"
              className="hero-social-icon"
              aria-label="Instagram"
            >
              IG
            </a>
            <a
              href={contact.facebook_url || 'https://facebook.com'}
              target="_blank"
              rel="noreferrer"
              className="hero-social-icon"
              aria-label="Facebook"
            >
              f
            </a>
            <span>{hero.social_prompt_text || 'Find us on social networks'}</span>
          </div>

          {/* Bottom-Right S-Curve White Cutout Summary */}
          <div className="hero-corner-summary">
            <Lines
              text={
                hero.right_corner_summary ||
                'We are an organization dedicated to\nprotecting the environment & nature.'
              }
            />
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. "LET'S MAKE OUR WORLD CLEANER & GREENER!" + 4 FLOATING VIGNETTES
         ==================================================================== */}
      <Reveal>
        <section id="mission-statement" className="mission-statement-section">
          <div className="mission-vignette vignette-1">
            <img src={mission.vignette_1_image || '/images/lagoon-mirror.jpg'} alt="Lagoon ecosystem" />
          </div>
          <div className="mission-vignette vignette-2">
            <img src={mission.vignette_2_image || '/images/mountain-mist.jpg'} alt="Alpine mist" />
          </div>
          <div className="mission-vignette vignette-3">
            <img src={mission.vignette_3_image || '/images/glacier-ice.jpg'} alt="Glacier ice" />
          </div>
          <div className="mission-vignette vignette-4">
            <img src={mission.vignette_4_image || '/images/canyon-ridge.jpg'} alt="Arid canyon" />
          </div>

          <h2 className="mission-statement-title">
            <Lines text={mission.heading || "Let's Make Our World\nCleaner & Greener!"} />
          </h2>
          <p className="mission-statement-sub">
            <Lines
              text={
                mission.subtitle ||
                'We work with partners & communities to ensure\nnature thrives and climate change is reversed'
              }
            />
          </p>

          <div className="mission-cta-row">
            <SmartLink to={mission.primary_cta_link || '/projects'} className="btn-outline-pill">
              <span>{mission.primary_cta_label || 'View Projects'}</span>
              <span>→</span>
            </SmartLink>
            <SmartLink to={mission.secondary_cta_link || '/mission'} className="link-dot-secondary">
              {mission.secondary_cta_label || 'Learn More'}
            </SmartLink>
          </div>
        </section>
      </Reveal>

      {/* ====================================================================
          3. 4-PILL HORIZONTAL BANNER STRIP (We · Protect · [→] · Nature)
         ==================================================================== */}
      <Reveal>
        <section className="pillars-strip" aria-label="We Protect Nature Pillars">
          <div className="pillar-pill pillar-pill-stone">
            <span className="pillar-pill-label">{pillars.pill_1_text || 'We'}</span>
          </div>

          <div className="pillar-pill pillar-pill-image">
            <img src={pillars.pill_2_image || '/images/glacier-ice.jpg'} alt="Glacial protection" />
            <span className="pillar-pill-label">{pillars.pill_2_text || 'Protect'}</span>
          </div>

          <SmartLink
            to={pillars.pill_3_link || '/mission'}
            className="pillar-pill pillar-pill-lime"
            aria-label="Explore our mission"
          >
            <svg width="68" height="42" viewBox="0 0 68 42" fill="none" aria-hidden="true">
              <path
                d="M4 21H62M62 21L44 4M62 21L44 38"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SmartLink>

          <div className="pillar-pill pillar-pill-image">
            <img src={pillars.pill_4_image || '/images/canyon-ridge.jpg'} alt="Canyon habitat" />
            <span className="pillar-pill-label">{pillars.pill_4_text || 'Nature'}</span>
          </div>
        </section>
      </Reveal>

      {/* ====================================================================
          4. INTERACTIVE "OUR INITIATIVES FOR 2026" TABLE WITH FLOATING PHOTO
         ==================================================================== */}
      <Reveal>
        <section className="initiatives-section">
          <div className="initiatives-header">
            <h2 className="initiatives-title">
              {initSection.heading || 'Our initiatives for 2026'}
            </h2>
            <p className="initiatives-subtitle">
              <Lines
                text={
                  initSection.subtitle ||
                  'Find out what projects we are\nimplementing to protect nature'
                }
              />
            </p>
          </div>

          <div className="initiatives-table-head">
            <span>{initSection.col_title_label || 'Title'}</span>
            <span>{initSection.col_tags_label || 'Tags'}</span>
            <span>{initSection.col_date_label || 'Date'}</span>
            <span />
          </div>

          <div>
            {initiatives.map((item) => {
              const isActive = hoveredInitId === item.id;
              return (
                <div
                  key={item.id}
                  className={`initiative-row ${isActive ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredInitId(item.id)}
                  onClick={() => setSelectedInitiative(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedInitiative(item);
                  }}
                >
                  <div className="initiative-row-title">{item.title}</div>

                  <div className="initiative-tags">
                    {(item.tags || []).map((tag, i) => (
                      <span
                        key={i}
                        className={`initiative-tag ${
                          item.highlight_tag || (isActive && i === 0) ? 'highlight' : ''
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="initiative-date">{item.event_date}</div>

                  <div className="initiative-action-cell">
                    <span className="initiative-arrow-btn">
                      {isActive ? '↗' : '→'}
                    </span>
                  </div>

                  {item.image && (
                    <div className="initiative-floating-preview" aria-hidden={!isActive}>
                      <img src={item.image} alt={item.title} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* ====================================================================
          5. 4 VERTICAL ECOLOGICAL PROBLEM CARDS (EXACT MOCKUP MATCH)
         ==================================================================== */}
      <Reveal>
        <section className="problems-grid-section" aria-label="Ecological Problems">
          <div className="problems-cards-grid">
            {problems.map((prob, index) => {
              const isFeatured = index === 0 || prob.featured;
              return (
                <article
                  key={prob.id}
                  className={`problem-card ${isFeatured ? 'featured' : ''}`}
                >
                  <img
                    src={prob.image || '/images/lagoon-mirror.jpg'}
                    alt={String(prob.title).replace(/\\n|\n/g, ' ')}
                    className="problem-card-bg"
                  />
                  <div className="problem-card-overlay" />

                  <div className="problem-card-top">
                    {isFeatured ? (
                      <div className="problem-badges-stack">
                        {prob.badge_1 && (
                          <span className="problem-glass-pill">
                            <span className="dot" />
                            <span>{prob.badge_1}</span>
                          </span>
                        )}
                        {prob.badge_2 && (
                          <span className="problem-glass-pill">
                            <span>{prob.badge_2}</span>
                            <span className="dot" />
                          </span>
                        )}
                      </div>
                    ) : (
                      <div />
                    )}

                    <button
                      type="button"
                      className="problem-corner-btn"
                      onClick={() => setSelectedProblem(prob)}
                      aria-label={`Inspect ${String(prob.title).replace(/\\n|\n/g, ' ')}`}
                    >
                      {isFeatured ? '→' : '↗'}
                    </button>
                  </div>

                  <div className="problem-card-bottom">
                    <h3 className="problem-card-title">
                      <Lines text={prob.title} />
                    </h3>
                    <p className="problem-card-desc">{prob.summary}</p>
                    <button
                      type="button"
                      className="problem-explore-btn"
                      onClick={() => setSelectedProblem(prob)}
                    >
                      <span>{probSection.explore_button_label || 'EXPLORE PROBLEM'}</span>
                      <span>›</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* ====================================================================
          6. NEW SECTION: VERIFIED IMPACT TELEMETRY & ACTIVE FIELD PROJECTS BENTO
         ==================================================================== */}
      <Reveal>
        <section className="home-extra-section" aria-label="Impact Metrics and Field Projects">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow-tag">
                <span className="dot" />
                <span>{impactSection.eyebrow || 'Verified Telemetry & Field Results'}</span>
              </span>
              <h2 className="section-display-h2">
                <Lines text={impactSection.heading || 'Measurable Restoration Across\nThreatened Watersheds'} />
              </h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 380, lineHeight: 1.55 }}>
              {impactSection.subtitle || 'Every hectare we protect is monitored via satellite radar, solar piezometers, and community water councils.'}
            </p>
          </div>

          {/* 4-Card Impact Bento Grid */}
          <div className="impact-bento-grid">
            {stats.map((st, idx) => (
              <div key={st.id} className={`impact-metric-card ${idx === 1 ? 'highlight' : ''}`}>
                <div className="impact-metric-top">
                  <span className="impact-metric-badge">Live Audit 2026</span>
                  <span style={{ fontSize: 14 }}>↗</span>
                </div>
                <div>
                  <div className="impact-metric-value">
                    <Counter value={st.value} suffix={st.suffix} />
                  </div>
                  <div className="impact-metric-label">{st.label}</div>
                  <div className="impact-metric-detail">{st.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filterable Active Field Projects Spotlight */}
          <div className="filter-bar" style={{ marginTop: 36, marginBottom: 22 }}>
            <h3 style={{ fontSize: 22, fontWeight: 500 }}>
              {impactSection.projects_heading || 'Active Field Expeditions & Dispatches'}
            </h3>
            <div className="filter-pills">
              {projectCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-pill ${homeProjectCat === cat ? 'active' : ''}`}
                  onClick={() => setHomeProjectCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="cards-grid-3" style={{ marginBottom: 20 }}>
            {visibleProjects.map((proj) => (
              <article key={proj.id} className="surface-card">
                <img src={proj.image} alt={proj.title} className="surface-card-img" />
                <div className="surface-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <span className="page-eyebrow-pill" style={{ marginBottom: 0, fontSize: 11 }}>{proj.category}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>📍 {proj.location}</span>
                  </div>
                  <h4 style={{ fontSize: 17.5, fontWeight: 600, lineHeight: 1.3 }}>{proj.title}</h4>
                  <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.55, flex: 1 }}>
                    {proj.summary}
                  </p>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}>
                      <span>{Number(proj.hectares_restored).toLocaleString()} ha restored</span>
                      <span>{proj.completion_pct}%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-stone)', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
                      <div style={{ width: `${proj.completion_pct}%`, height: '100%', background: 'var(--primary)' }} />
                    </div>
                  </div>
                  <Link to={`/projects/${proj.slug}`} className="btn-outline-pill" style={{ justifyContent: 'space-between' }}>
                    <span>Explore Field Dispatch</span>
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/projects" className="btn-outline-pill">
              <span>{impactSection.projects_cta_label || 'View All Field Projects'}</span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </Reveal>

      {/* ====================================================================
          7. NEW SECTION: FRONTLINE VOICES & SCIENTIFIC COALITION BENTO
         ==================================================================== */}
      <Reveal>
        <section className="home-extra-section" aria-label="Frontline Voices and Partners">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow-tag">
                <span className="dot" />
                <span>{voicesSection.eyebrow || 'Frontline Coalition'}</span>
              </span>
              <h2 className="section-display-h2">
                <Lines text={voicesSection.heading || 'Voices From Indigenous Guardians\n& Field Hydrologists'} />
              </h2>
            </div>
          </div>

          <div className="voices-bento-wrap">
            <div className="voices-visual-card">
              <img src="/images/hero-basin.jpg" alt="Altiplano Water Council Field Station" />
              <div className="voices-visual-content">
                <span className="problem-glass-pill">
                  <span className="dot" />
                  <span>64 Solar Telemetry Nodes Online</span>
                </span>
              </div>
              <div className="voices-visual-content">
                <div style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.25, marginBottom: 6 }}>
                  Community-Owned Watershed Governance
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.82)', lineHeight: 1.45 }}>
                  Direct satellite & piezometer feeds shared openly with local water councils across 14 basins.
                </p>
              </div>
            </div>

            {currentVoice && (
              <div className="voices-quote-bento">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="page-eyebrow-pill" style={{ marginBottom: 0 }}>Verified Field Testimony</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="nav-pill"
                      onClick={() => setVoiceIndex((voiceIndex - 1 + testimonials.length) % testimonials.length)}
                      aria-label="Previous voice"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      className="nav-pill"
                      onClick={() => setVoiceIndex((voiceIndex + 1) % testimonials.length)}
                      aria-label="Next voice"
                    >
                      Next →
                    </button>
                  </div>
                </div>

                <blockquote className="testimonial-quote" style={{ fontSize: 'clamp(17px, 2vw, 22px)' }}>
                  “{currentVoice.quote}”
                </blockquote>

                <div className="testimonial-meta">
                  <div className="testimonial-author">
                    <img src={currentVoice.avatar} alt={currentVoice.author} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{currentVoice.author}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{currentVoice.role}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)' }}>
                    {(voiceIndex % testimonials.length) + 1} / {testimonials.length}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="partners-marquee-bar">
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
              {voicesSection.partners_label || 'Audited & Supported By Global Research Institutions'}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {partners.map((pt) => (
                <a
                  key={pt.id}
                  href={pt.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="nav-pill"
                  style={{ fontSize: 12, padding: '6px 14px' }}
                >
                  <span>{pt.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ====================================================================
          8. NEW SECTION: TRANSPARENCY FAQ ACCORDION & EXPEDITION CALLOUT
         ==================================================================== */}
      <Reveal>
        <section className="home-extra-section" aria-label="Frequently Asked Questions">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow-tag">
                <span className="dot" />
                <span>{faqSection.eyebrow || 'Transparency & Operations'}</span>
              </span>
              <h2 className="section-display-h2">
                <Lines text={faqSection.heading || 'Common Questions About Our\nField Expeditions & Funding'} />
              </h2>
            </div>
          </div>

          <div className="faq-bento-split">
            <div className="expedition-callout-card">
              <span className="nav-pill" style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.65)', border: 'none' }}>
                ☀️ 94% Direct Field Allocation
              </span>
              <h3 style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                {faqSection.callout_title || 'Ready to Join a 2026 Conservation Expedition?'}
              </h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(18,20,18,0.82)' }}>
                {faqSection.callout_body || 'Whether you fund a solar telemetry node or join our May coastal lagoon cleanup in person, 94% of every contribution goes directly to frontline restoration.'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
                <Link to="/contribution" className="hero-subscribe-btn">
                  <span>{faqSection.callout_primary_label || 'Pledge Monthly Support'}</span>
                  <span>→</span>
                </Link>
                <Link to="/contribution?tab=volunteer" className="btn-outline-pill" style={{ background: 'transparent', borderColor: 'var(--accent)' }}>
                  <span>{faqSection.callout_secondary_label || 'Apply as Field Volunteer'}</span>
                </Link>
              </div>
            </div>

            <div>
              <FAQAccordion items={faqs} />
            </div>
          </div>
        </section>
      </Reveal>

      {/* Initiative Detail Modal */}
      <Modal
        open={Boolean(selectedInitiative)}
        onClose={() => setSelectedInitiative(null)}
        title={selectedInitiative?.title}
      >
        {selectedInitiative && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <img
              src={selectedInitiative.image}
              alt={selectedInitiative.title}
              style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 18 }}
            />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 12.5 }}>
              <span className="page-eyebrow-pill" style={{ marginBottom: 0 }}>
                Date: {selectedInitiative.event_date}
              </span>
              <span className="nav-pill">📍 {selectedInitiative.location}</span>
              <span className="nav-pill">👥 Goal: {selectedInitiative.participants_goal} Volunteers</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>
              {selectedInitiative.summary}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                type="button"
                className="btn-primary-lime"
                onClick={() => {
                  const initName = selectedInitiative.title;
                  setSelectedInitiative(null);
                  navigate(`/contribution?tab=volunteer&initiative=${encodeURIComponent(initName)}`);
                }}
              >
                Register as Volunteer →
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Problem Deep-Dive Modal */}
      <Modal
        open={Boolean(selectedProblem)}
        onClose={() => setSelectedProblem(null)}
        title={String(selectedProblem?.title || '').replace(/\\n|\n/g, ' ')}
      >
        {selectedProblem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <img
              src={selectedProblem.image}
              alt={selectedProblem.title}
              style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 18 }}
            />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="page-eyebrow-pill" style={{ marginBottom: 0 }}>
                Severity: {selectedProblem.severity}
              </span>
              <span className="nav-pill">
                <strong>{selectedProblem.metric_value}</strong> — {selectedProblem.metric_label}
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--text-main)' }}>
              {selectedProblem.full_analysis}
            </p>
            {selectedProblem.solution_steps?.length > 0 && (
              <div style={{ background: 'var(--bg-stone)', padding: 18, borderRadius: 16 }}>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>
                  Active Field Remediation Protocol:
                </h4>
                <ul style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                  {selectedProblem.solution_steps.map((s, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 8 }}>
              <button
                type="button"
                className="btn-outline-pill"
                onClick={() => {
                  const slug = selectedProblem.slug;
                  setSelectedProblem(null);
                  navigate(`/problems?focus=${slug}`);
                }}
              >
                Open Full Dossier
              </button>
              <button
                type="button"
                className="btn-primary-lime"
                onClick={() => {
                  const area = String(selectedProblem.title).replace(/\\n|\n/g, ' ');
                  setSelectedProblem(null);
                  navigate(`/contribution?focus=${encodeURIComponent(area)}`);
                }}
              >
                Fund This Remediation →
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
