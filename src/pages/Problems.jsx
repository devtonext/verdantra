import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSite, usePageTitle } from '../lib/site.jsx';
import Lines from '../components/Lines.jsx';
import Reveal from '../components/Reveal.jsx';

export default function Problems() {
  usePageTitle('Ecological Problems');
  const [searchParams, setSearchParams] = useSearchParams();
  const { content, collections } = useSite();

  const page = content?.problems_page || {};
  const problems = collections?.problems || [];
  const projects = collections?.projects || [];

  const focusSlug = searchParams.get('focus') || problems[0]?.slug || '';
  const [selectedSlug, setSelectedSlug] = useState(focusSlug);

  useEffect(() => {
    if (searchParams.get('focus')) {
      setSelectedSlug(searchParams.get('focus'));
    }
  }, [searchParams]);

  const activeProblem = problems.find((p) => p.slug === selectedSlug) || problems[0];

  return (
    <div>
      <section className="page-hero-banner" style={{ gridTemplateColumns: '1fr' }}>
        <div>
          <span className="page-eyebrow-pill">
            <span>🌍</span>
            <span>{page.eyebrow || 'Planetary Diagnostics'}</span>
          </span>
          <h1 className="page-hero-title">
            <Lines text={page.heading || 'Four Interlocking Crises\nThreatening Global Biospheres'} />
          </h1>
          <p className="page-hero-sub" style={{ maxWidth: 680 }}>{page.subtitle}</p>
        </div>
      </section>

      {/* Interactive Selector Pills */}
      <div className="filter-bar">
        <div className="filter-pills">
          {problems.map((p) => {
            const cleanTitle = String(p.title).replace(/\\n|\n/g, ' ');
            return (
              <button
                key={p.id}
                type="button"
                className={`filter-pill ${activeProblem?.slug === p.slug ? 'active' : ''}`}
                onClick={() => {
                  setSelectedSlug(p.slug);
                  setSearchParams({ focus: p.slug });
                }}
              >
                {cleanTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Selected Problem Dossier */}
      {activeProblem && (
        <Reveal>
          <section
            style={{
              background: 'var(--bg-stone)',
              borderRadius: 28,
              padding: 36,
              marginBottom: 56,
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr',
              gap: 32,
              alignItems: 'center'
            }}
          >
            <img
              src={activeProblem.image}
              alt={activeProblem.title}
              style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 22 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="page-eyebrow-pill" style={{ marginBottom: 0 }}>
                  {activeProblem.badge_1 || 'Ecological Alert'}
                </span>
                <span className="nav-pill">Severity: {activeProblem.severity}</span>
              </div>
              <h2 style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-0.025em' }}>
                {String(activeProblem.title).replace(/\\n|\n/g, ' ')}
              </h2>
              <div style={{ background: '#ffffff', padding: '14px 18px', borderRadius: 16, border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{activeProblem.metric_value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{activeProblem.metric_label}</div>
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-main)' }}>
                {activeProblem.full_analysis}
              </p>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                  Verdantra Field Remediation Protocol:
                </h3>
                <ul style={{ paddingLeft: 18, fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                  {(activeProblem.solution_steps || []).map((step, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{step}</li>
                  ))}
                </ul>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <Link
                  to={`/contribution?focus=${encodeURIComponent(String(activeProblem.title).replace(/\\n|\n/g, ' '))}`}
                  className="btn-primary-lime"
                >
                  Fund Remediation for This Crisis →
                </Link>
                <Link to="/projects" className="btn-outline-pill">
                  See Field Projects →
                </Link>
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* All 4 Vertical Problem Cards */}
      <Reveal>
        <h3 style={{ fontSize: 22, fontWeight: 500, marginBottom: 18 }}>Compare All Tracked Biospheres</h3>
        <div className="problems-cards-grid" style={{ marginBottom: 56 }}>
          {problems.map((prob) => {
            const isSelected = activeProblem?.id === prob.id;
            return (
              <article key={prob.id} className={`problem-card ${isSelected ? 'featured' : ''}`}>
                <img src={prob.image} alt={prob.title} className="problem-card-bg" />
                <div className="problem-card-overlay" />
                <div className="problem-card-top">
                  <span className="problem-glass-pill">
                    <span className="dot" />
                    <span>{prob.badge_1}</span>
                  </span>
                  <button
                    type="button"
                    className="problem-corner-btn"
                    onClick={() => {
                      setSelectedSlug(prob.slug);
                      setSearchParams({ focus: prob.slug });
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                  >
                    →
                  </button>
                </div>
                <div className="problem-card-bottom">
                  <h4 className="problem-card-title">
                    <Lines text={prob.title} />
                  </h4>
                  <p className="problem-card-desc">{prob.summary}</p>
                  <button
                    type="button"
                    className="problem-explore-btn"
                    onClick={() => {
                      setSelectedSlug(prob.slug);
                      setSearchParams({ focus: prob.slug });
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                  >
                    <span>INSPECT DOSSIER</span>
                    <span>›</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
