import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../lib/site.jsx';
import Lines from './Lines.jsx';
import { BrandEmblem } from './Header.jsx';

export default function Footer() {
  const { content, collections, api, addToast } = useSite();
  const general = content?.general || {};
  const contact = content?.contact || {};
  const news = content?.home_newsletter || {};
  const problems = collections?.problems || [];
  const projects = collections?.projects || [];

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.submit('subscribers', { email: email.trim(), source: 'footer_newsletter' });
      setEmail('');
      addToast('Subscribed! Welcome to Verdantra field dispatches.');
    } catch (err) {
      addToast(err.message || 'Subscription failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="site-footer">
      {/* Row 1: Newsletter Signup */}
      <div className="footer-newsletter-grid">
        <div>
          <span className="footer-tag-pill">{news.badge_label || 'newsletter'}</span>
        </div>

        <div>
          <h2 className="footer-newsletter-title">
            <Lines text={news.heading || 'Subscribe to our newsletter to get the latest\nupdates on missions projects & initiatives.'} />
          </h2>
          <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              className="footer-newsletter-input"
              placeholder={news.input_placeholder || 'Email address'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Newsletter email address"
            />
            <button type="submit" className="footer-newsletter-btn" disabled={submitting}>
              <span>{submitting ? 'Joining…' : news.button_label || 'Subscribe'}</span>
              <span>→</span>
            </button>
          </form>
        </div>
      </div>

      {/* Row 2: 4-Column Footer Navigation Menus */}
      <div className="footer-menus-grid">
        <div>
          <Link to="/" className="brand-logo" style={{ fontSize: 17, marginBottom: 12 }}>
            <span className="brand-logo-mark">
              <BrandEmblem />
            </span>
            <span>{general.brand_name || 'Verdantra'}</span>
          </Link>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 290, marginBottom: 14 }}>
            {general.footer_tagline || 'We are an organization dedicated to protecting the environment & nature.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5, fontWeight: 600 }}>
            <a href={`mailto:${contact.email || 'field-ops@verdantra.org'}`}>{contact.email || 'field-ops@verdantra.org'}</a>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{contact.phone || '+1 (415) 890-4320'}</span>
          </div>
        </div>

        <div>
          <div className="footer-menu-col-title">{news.menu_col_1_title || 'Navigation'}</div>
          <ul className="footer-menu-list">
            <li><Link to="/" className="footer-menu-link">Home</Link></li>
            <li><Link to="/mission" className="footer-menu-link">Our Mission & Scientists</Link></li>
            <li><Link to="/contribution" className="footer-menu-link">Contribution & Tiers</Link></li>
            <li><Link to="/contribution?tab=volunteer" className="footer-menu-link">Volunteer Expeditions</Link></li>
            <li><Link to="/contact" className="footer-menu-link">Contact Science Desk</Link></li>
          </ul>
        </div>

        <div>
          <div className="footer-menu-col-title">{news.menu_col_2_title || 'Ecological Frontlines'}</div>
          <ul className="footer-menu-list">
            {problems.map((p) => (
              <li key={p.id}>
                <Link to={`/problems?focus=${p.slug}`} className="footer-menu-link">
                  {String(p.title).replace(/\\n|\n/g, ' ')}
                </Link>
              </li>
            ))}
            <li><Link to="/problems" className="footer-menu-link">All Planetary Dossiers →</Link></li>
          </ul>
        </div>

        <div>
          <div className="footer-menu-col-title">{news.menu_col_3_title || 'Field Expeditions'}</div>
          <ul className="footer-menu-list">
            {projects.slice(0, 4).map((pr) => (
              <li key={pr.id}>
                <Link to={`/projects/${pr.slug}`} className="footer-menu-link">
                  {pr.title.length > 32 ? `${pr.title.slice(0, 32)}…` : pr.title}
                </Link>
              </li>
            ))}
            <li><Link to="/projects" className="footer-menu-link">View All Field Projects →</Link></li>
          </ul>
        </div>
      </div>

      {/* Row 3: Bottom Copyright & Social Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-copyright">
          {general.footer_copyright || '©2026, All Right Reserved'}
        </div>

        <Link to="/" className="brand-logo" style={{ fontSize: 15 }}>
          <span className="brand-logo-mark">
            <BrandEmblem />
          </span>
          <span>{general.brand_name || 'Verdantra'}</span>
        </Link>

        <div className="footer-socials-group">
          <a href={contact.facebook_url || 'https://facebook.com'} target="_blank" rel="noreferrer" className="footer-social-pill">
            Facebook
          </a>
          <a href={contact.twitter_url || 'https://twitter.com'} target="_blank" rel="noreferrer" className="footer-social-pill">
            Twitter
          </a>
          <a href={contact.instagram_url || 'https://instagram.com'} target="_blank" rel="noreferrer" className="footer-social-pill">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
