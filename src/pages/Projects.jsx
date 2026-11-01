import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSite, usePageTitle } from '../lib/site.jsx';
import Lines from '../components/Lines.jsx';
import Reveal from '../components/Reveal.jsx';

export default function Projects() {
  const { slug } = useParams();
  const { content, collections } = useSite();

  const page = content?.projects_page || {};
  const projects = collections?.projects || [];

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const detailProject = slug ? projects.find((p) => p.slug === slug) : null;
  usePageTitle(detailProject ? detailProject.title : 'Field Projects & Dispatches');

  if (detailProject) {
    const related = projects.filter((p) => p.id !== detailProject.id).slice(0, 3);
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <Link to="/projects" className="nav-pill">
            ← Back to All Field Projects
          </Link>
        </div>

        <article
          style={{
            background: 'var(--bg-stone)',
            borderRadius: 28,
            padding: 40,
            marginBottom: 56
          }}
        >
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            <span className="page-eyebrow-pill" style={{ marginBottom: 0 }}>{detailProject.category}</span>
            <span className="nav-pill">📍 {detailProject.location}</span>
            <span className="nav-pill">Status: {detailProject.status}</span>
            <span className="nav-pill">🌿 {Number(detailProject.hectares_restored).toLocaleString()} ha restored</span>
          </div>

          <h1 className="page-hero-title" style={{ maxWidth: 860 }}>
            {detailProject.title}
          </h1>

          <img
            src={detailProject.image}
            alt={detailProject.title}
            style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 22, margin: '24px 0' }}
          />

          <div
            style={{
              background: '#ffffff',
              padding: 20,
              borderRadius: 18,
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                <span>Field Restoration Milestone</span>
                <span>{detailProject.completion_pct}% Complete</span>
              </div>
              <div style={{ height: 10, background: 'var(--bg-stone)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${detailProject.completion_pct}%`, height: '100%', background: 'var(--primary)' }} />
              </div>
            </div>
            <Link
              to={`/contribution?focus=${encodeURIComponent(detailProject.category)}`}
              className="btn-primary-lime"
            >
              Sponsor This Field Project →
            </Link>
          </div>

          <div style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--text-main)', maxWidth: 820 }}>
            {String(detailProject.body || detailProject.summary)
              .split(/\n\n|\\n\\n/)
              .map((para, i) => (
                <p key={i} style={{ marginBottom: 18 }}>{para}</p>
              ))}
          </div>
        </article>

        {related.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: 20 }}>Related Field Operations</h2>
            <div className="cards-grid-3">
              {related.map((rel) => (
                <article key={rel.id} className="surface-card">
                  <img src={rel.image} alt={rel.title} className="surface-card-img" />
                  <div className="surface-card-body">
                    <span className="nav-pill" style={{ alignSelf: 'flex-start', fontSize: 11 }}>{rel.category}</span>
                    <h3 style={{ fontSize: 17, fontWeight: 600 }}>{rel.title}</h3>
                    <p style={{ fontSize: 12.5, color: 'var(--text-muted)', flex: 1 }}>{rel.summary}</p>
                    <Link to={`/projects/${rel.slug}`} className="btn-outline-pill" style={{ justifyContent: 'center' }}>
                      Read Field Report →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const filteredProjects = projects.filter((p) => {
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div>
      <section className="page-hero-banner" style={{ gridTemplateColumns: '1fr' }}>
        <div>
          <span className="page-eyebrow-pill">
            <span>🛰️</span>
            <span>{page.eyebrow || 'Field Operations & Reports'}</span>
          </span>
          <h1 className="page-hero-title">
            <Lines text={page.heading || 'Active Conservation Projects\n& Expedition Dispatches'} />
          </h1>
          <p className="page-hero-sub" style={{ maxWidth: 680 }}>{page.subtitle}</p>
        </div>
      </section>

      <div className="filter-bar">
        <div className="filter-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="search"
          className="search-input-pill"
          placeholder="Search projects by title or basin…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search field projects"
        />
      </div>

      <Reveal>
        <div className="cards-grid-3">
          {filteredProjects.map((proj) => (
            <article key={proj.id} className="surface-card">
              <img src={proj.image} alt={proj.title} className="surface-card-img" />
              <div className="surface-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <span className="page-eyebrow-pill" style={{ marginBottom: 0, fontSize: 11 }}>{proj.category}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>📍 {proj.location}</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>{proj.title}</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, flex: 1 }}>
                  {proj.summary}
                </p>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}>
                    <span>{Number(proj.hectares_restored).toLocaleString()} ha restored</span>
                    <span>{proj.completion_pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-stone)', borderRadius: 999, overflow: 'hidden', marginBottom: 14 }}>
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
      </Reveal>
    </div>
  );
}
