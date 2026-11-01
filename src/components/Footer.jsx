import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../lib/site.jsx';
import Lines from './Lines.jsx';
import { BrandEmblem } from './Header.jsx';

export default function Footer() {
  const { content, api, addToast } = useSite();
  const general = content?.general || {};
  const contact = content?.contact || {};
  const news = content?.home_newsletter || {};

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
