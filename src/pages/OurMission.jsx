import React, { useState } from 'react';
import { useSite, usePageTitle } from '../lib/site.jsx';
import Lines from '../components/Lines.jsx';
import Reveal from '../components/Reveal.jsx';
import Counter from '../components/Counter.jsx';

export default function OurMission() {
  usePageTitle('Our Mission');
  const { content, collections } = useSite();

  const page = content?.mission_page || {};
  const stats = collections?.stats || [];
  const team = collections?.team || [];
  const testimonials = collections?.testimonials || [];
  const partners = collections?.partners || [];

  const [slideIdx, setSlideIdx] = useState(0);
  const activeTestimonial = testimonials[slideIdx] || testimonials[0];

  return (
    <div>
      <section className="page-hero-banner">
        <div>
          <span className="page-eyebrow-pill">
            <span>☀️</span>
            <span>{page.eyebrow || 'Our Scientific Mandate'}</span>
          </span>
          <h1 className="page-hero-title">
            <Lines text={page.heading || 'Restoring Earth’s Fragile\nBiomes Through Field Science'} />
          </h1>
          <p className="page-hero-sub">{page.subtitle}</p>
        </div>
        <div>
          <img
            src={page.banner_image || '/images/hero-basin.jpg'}
            alt="Field conservation basin"
            style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 22 }}
          />
        </div>
      </section>

      {/* Animated Stats Band */}
      <Reveal>
        <section className="stats-band" aria-label="Impact Metrics">
          {stats.map((st) => (
            <div key={st.id} className="stat-card">
              <div className="stat-value">
                <Counter value={st.value} suffix={st.suffix} />
              </div>
              <div className="stat-label">{st.label}</div>
              <div className="stat-detail">{st.detail}</div>
            </div>
          ))}
        </section>
      </Reveal>

      {/* Manifesto Block */}
      <Reveal>
        <section
          style={{
            background: 'var(--primary)',
            borderRadius: 28,
            padding: '44px 40px',
            marginBottom: 64,
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: 28,
            alignItems: 'center'
          }}
        >
          <h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>
            {page.manifesto_title || 'Why We Operate at the Frontlines'}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.65 }}>
            {page.manifesto_body}
          </p>
        </section>
      </Reveal>

      {/* Field Leadership & Scientists Team */}
      <Reveal>
        <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 22 }}>
          Field Scientists & Expedition Leads
        </h2>
        <div className="cards-grid-4">
          {team.map((member) => (
            <article key={member.id} className="surface-card">
              <img src={member.image} alt={member.name} className="surface-card-img" />
              <div className="surface-card-body">
                <span className="nav-pill" style={{ alignSelf: 'flex-start', fontSize: 11 }}>
                  📍 {member.location}
                </span>
                <h3 style={{ fontSize: 17, fontWeight: 600 }}>{member.name}</h3>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)' }}>
                  {member.role}
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      {/* Interactive Testimonial Slider */}
      {activeTestimonial && (
        <Reveal>
          <section className="testimonial-slider" aria-label="Community Voices">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="page-eyebrow-pill" style={{ marginBottom: 0 }}>Frontline Voices</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="nav-pill"
                  onClick={() => setSlideIdx((slideIdx - 1 + testimonials.length) % testimonials.length)}
                  aria-label="Previous testimonial"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  className="nav-pill"
                  onClick={() => setSlideIdx((slideIdx + 1) % testimonials.length)}
                  aria-label="Next testimonial"
                >
                  Next →
                </button>
              </div>
            </div>
            <blockquote className="testimonial-quote">
              “{activeTestimonial.quote}”
            </blockquote>
            <div className="testimonial-meta">
              <div className="testimonial-author">
                <img src={activeTestimonial.avatar} alt={activeTestimonial.author} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{activeTestimonial.author}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{activeTestimonial.role}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {slideIdx + 1} / {testimonials.length}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* Institutional Partners */}
      <Reveal>
        <section style={{ marginBottom: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-muted)' }}>
            Scientific & Institutional Partners
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {partners.map((pt) => (
              <a
                key={pt.id}
                href={pt.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="nav-pill"
                style={{ padding: '10px 18px' }}
              >
                <span>{pt.name}</span>
                <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>({pt.region})</span>
              </a>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
