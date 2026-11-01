import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useSite } from '../lib/site.jsx';
import SmartLink from './SmartLink.jsx';

export function BrandEmblem() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L14.2 7.8L20 6L16.4 11L22 12L16.4 13L20 18L14.2 16.2L12 22L9.8 16.2L4 18L7.6 13L2 12L7.6 11L4 6L9.8 7.8L12 2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  const { content, collections } = useSite();
  const general = content?.general || {};
  const problems = collections?.problems || [];
  const projects = collections?.projects || [];
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hideAnnouncement, setHideAnnouncement] = useState(false);

  return (
    <>
      {general.announcement_enabled && !hideAnnouncement && (
        <div className="announcement-bar">
          <div className="announcement-bar-inner">
            <span className="announcement-dot" />
            <span>{general.announcement_text}</span>
            {general.announcement_link && (
              <SmartLink to={general.announcement_link} className="announcement-link">
                Join Expedition →
              </SmartLink>
            )}
          </div>
          <button
            type="button"
            className="announcement-close"
            onClick={() => setHideAnnouncement(true)}
            aria-label="Dismiss announcement"
          >
            ✕
          </button>
        </div>
      )}

      <header className="site-header">
        {/* Left 3 Nav Pills */}
        <nav className="nav-group-left" aria-label="Primary Left Navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}>
            {location.pathname === '/' && <span className="nav-pill-dot" />}
            <span>{general.nav_home_label || 'Home'}</span>
          </NavLink>
          <NavLink to="/contribution" className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}>
            {location.pathname.startsWith('/contribution') && <span className="nav-pill-dot" />}
            <span>{general.nav_contribution_label || 'Contribution'}</span>
          </NavLink>
          <NavLink to="/mission" className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}>
            {location.pathname.startsWith('/mission') && <span className="nav-pill-dot" />}
            <span>{general.nav_mission_label || 'Our Mission'}</span>
          </NavLink>
        </nav>

        {/* Center Brand Emblem & Name */}
        <Link to="/" className="brand-logo">
          <span className="brand-logo-mark">
            <BrandEmblem />
          </span>
          <span>{general.brand_name || 'Verdantra'}</span>
        </Link>

        {/* Right Dropdown Pills + Contact CTA */}
        <nav className="nav-group-right" aria-label="Primary Right Navigation">
          <div
            className="nav-dropdown-wrap"
            onMouseEnter={() => setOpenMenu('problems')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <NavLink
              to="/problems"
              className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
            >
              <span>{general.nav_problems_label || 'Problems'}</span>
              <span style={{ fontSize: 10 }}>⌄</span>
            </NavLink>
            {openMenu === 'problems' && (
              <div className="nav-dropdown-menu">
                {problems.map((p) => (
                  <Link
                    key={p.id}
                    to={`/problems?focus=${p.slug}`}
                    className="nav-dropdown-item"
                    onClick={() => setOpenMenu(null)}
                  >
                    <span>{String(p.title).replace(/\\n|\n/g, ' ')}</span>
                    <span className="tag-dot" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div
            className="nav-dropdown-wrap"
            onMouseEnter={() => setOpenMenu('projects')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <NavLink
              to="/projects"
              className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
            >
              <span>{general.nav_projects_label || 'Projects'}</span>
              <span style={{ fontSize: 10 }}>⌄</span>
            </NavLink>
            {openMenu === 'projects' && (
              <div className="nav-dropdown-menu">
                {projects.slice(0, 4).map((pr) => (
                  <Link
                    key={pr.id}
                    to={`/projects/${pr.slug}`}
                    className="nav-dropdown-item"
                    onClick={() => setOpenMenu(null)}
                  >
                    <span>{pr.title.slice(0, 28)}…</span>
                    <span className="tag-dot" />
                  </Link>
                ))}
                <Link
                  to="/projects"
                  className="nav-dropdown-item"
                  style={{ fontWeight: 700, borderTop: '1px solid var(--border-light)', marginTop: 4 }}
                  onClick={() => setOpenMenu(null)}
                >
                  <span>View All Field Projects →</span>
                </Link>
              </div>
            )}
          </div>

          <SmartLink to={general.nav_cta_link || '/contact'} className="nav-pill-cta">
            {general.nav_cta_label || 'Contact Us'}
          </SmartLink>
        </nav>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </header>

      {mobileOpen && (
        <div
          style={{
            padding: '16px 20px 24px',
            background: '#ffffff',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}
        >
          <Link to="/" className="nav-pill" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/contribution" className="nav-pill" onClick={() => setMobileOpen(false)}>Contribution</Link>
          <Link to="/mission" className="nav-pill" onClick={() => setMobileOpen(false)}>Our Mission</Link>
          <Link to="/problems" className="nav-pill" onClick={() => setMobileOpen(false)}>Problems</Link>
          <Link to="/projects" className="nav-pill" onClick={() => setMobileOpen(false)}>Projects</Link>
          <Link to="/contact" className="nav-pill-cta" style={{ textAlign: 'center' }} onClick={() => setMobileOpen(false)}>
            Contact Us
          </Link>
          
        </div>
      )}
    </>
  );
}
