import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSite, usePageTitle } from '../lib/site.jsx';
import Lines from '../components/Lines.jsx';
import Reveal from '../components/Reveal.jsx';

export default function Contact() {
  usePageTitle('Contact Us');
  const [searchParams] = useSearchParams();
  const { content, api, addToast } = useSite();

  const page = content?.contact_page || {};
  const contact = content?.contact || {};

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(searchParams.get('subject') || 'Watershed Partnership Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submit('messages', {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim()
      });
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      addToast('Message dispatched! Our field team will reply shortly.');
    } catch (err) {
      addToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="page-hero-banner" style={{ gridTemplateColumns: '1fr' }}>
        <div>
          <span className="page-eyebrow-pill">
            <span>📬</span>
            <span>{page.eyebrow || 'Direct Dispatch'}</span>
          </span>
          <h1 className="page-hero-title">
            <Lines text={page.heading || 'Connect With Our Field\nCoordinators & Science Desk'} />
          </h1>
          <p className="page-hero-sub" style={{ maxWidth: 680 }}>{page.subtitle}</p>
        </div>
      </section>

      <Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 28,
            marginBottom: 64
          }}
          className="form-grid-2"
        >
          <div className="form-card">
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 18 }}>Send a Direct Message</h2>
            {sent && (
              <div style={{ background: 'var(--primary)', padding: 14, borderRadius: 12, marginBottom: 18, fontSize: 13.5, fontWeight: 600 }}>
                ✓ Message received! You can inspect this submission inside the Admin Inbox (`/admin`).
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="contact-name">Your Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Dr. Clara Jiménez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="contact-email">Email Address *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="clara@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="contact-phone">Phone Number</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    className="form-input"
                    placeholder="+1 (415) 890-4320"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="contact-subject">Subject *</label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    className="form-input"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="contact-message">Message *</label>
                <textarea
                  id="contact-message"
                  rows="5"
                  required
                  className="form-textarea"
                  placeholder="Tell us about your watershed project, research inquiry, or expedition question…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary-lime" disabled={submitting}>
                {submitting ? 'Sending Dispatch…' : 'Send Message →'}
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="stat-card">
              <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginBottom: 4 }}>SCIENCE & FIELD DESK</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{contact.email}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{contact.phone}</div>
            </div>

            <div className="stat-card">
              <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginBottom: 4 }}>HEADQUARTERS</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 6 }}>{contact.address}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{contact.hours}</div>
            </div>

            <div
              style={{
                borderRadius: 22,
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-stone)',
                flex: 1,
                minHeight: 220,
                position: 'relative'
              }}
            >
              <img
                src="/images/hero-basin.jpg"
                alt="Atacama & Altiplano Field Station Map"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 14,
                  left: 14,
                  background: 'rgba(255,255,255,0.92)',
                  padding: '8px 14px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600
                }}
              >
                📍 Salar Basin Telemetry Station (-23.01°, -68.15°)
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
