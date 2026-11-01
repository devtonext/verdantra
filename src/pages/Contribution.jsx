import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSite, usePageTitle } from '../lib/site.jsx';
import Lines from '../components/Lines.jsx';
import Reveal from '../components/Reveal.jsx';
import FAQAccordion from '../components/FAQAccordion.jsx';

export default function Contribution() {
  usePageTitle('Contribution & Volunteering');
  const [searchParams] = useSearchParams();
  const { content, collections, api, addToast } = useSite();

  const page = content?.contribution_page || {};
  const tiers = collections?.tiers || [];
  const initiatives = collections?.initiatives || [];
  const faqs = collections?.faqs || [];

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'volunteer' ? 'volunteer' : 'donate');
  const [calcAmount, setCalcAmount] = useState(95);

  // Donation form state
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [amount, setAmount] = useState(Number(searchParams.get('amount')) || 95);
  const [frequency, setFrequency] = useState('monthly');
  const [tierName, setTierName] = useState(searchParams.get('tier') || 'Watershed Guardian');
  const [focusArea, setFocusArea] = useState(searchParams.get('focus') || 'Ocean Pollution');
  const [notes, setNotes] = useState('');
  const [donSubmitting, setDonSubmitting] = useState(false);
  const [donSuccess, setDonSuccess] = useState(false);

  // Volunteer form state
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volInitiative, setVolInitiative] = useState(searchParams.get('initiative') || 'Beach cleanup');
  const [volAvailability, setVolAvailability] = useState('May 2026 Expedition');
  const [volSkills, setVolSkills] = useState('');
  const [volSubmitting, setVolSubmitting] = useState(false);
  const [volSuccess, setVolSuccess] = useState(false);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'volunteer' || t === 'donate') setActiveTab(t);
    if (searchParams.get('initiative')) {
      setVolInitiative(searchParams.get('initiative'));
      setActiveTab('volunteer');
    }
    if (searchParams.get('focus')) {
      setFocusArea(searchParams.get('focus'));
    }
  }, [searchParams]);

  const handleSelectTier = (tier) => {
    setAmount(tier.amount);
    setFrequency(tier.frequency || 'monthly');
    setTierName(tier.name);
    setActiveTab('donate');
    document.getElementById('contribution-forms')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setDonSubmitting(true);
    try {
      await api.submit('donations', {
        donor_name: donorName.trim(),
        email: donorEmail.trim(),
        amount: Number(amount),
        frequency,
        tier_name: tierName,
        focus_area: focusArea,
        notes: notes.trim()
      });
      setDonSuccess(true);
      setDonorName('');
      setDonorEmail('');
      setNotes('');
      addToast('Contribution pledge recorded! Check the Admin Inbox to view.');
    } catch (err) {
      addToast(err.message || 'Submission failed', 'error');
    } finally {
      setDonSubmitting(false);
    }
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    setVolSubmitting(true);
    try {
      await api.submit('volunteers', {
        full_name: volName.trim(),
        email: volEmail.trim(),
        phone: volPhone.trim(),
        initiative: volInitiative,
        availability: volAvailability,
        skills: volSkills.trim()
      });
      setVolSuccess(true);
      setVolName('');
      setVolEmail('');
      setVolPhone('');
      setVolSkills('');
      addToast('Volunteer application submitted! Our field desk will contact you.');
    } catch (err) {
      addToast(err.message || 'Submission failed', 'error');
    } finally {
      setVolSubmitting(false);
    }
  };

  return (
    <div>
      <section className="page-hero-banner">
        <div>
          <span className="page-eyebrow-pill">
            <span>✦</span>
            <span>{page.eyebrow || 'Direct Ecological Action'}</span>
          </span>
          <h1 className="page-hero-title">
            <Lines text={page.heading || 'Fuel Frontline Restoration &\nCommunity Stewardship'} />
          </h1>
          <p className="page-hero-sub">{page.subtitle}</p>
        </div>

        {/* Interactive Impact Calculator */}
        <div style={{ background: '#ffffff', padding: 28, borderRadius: 24, border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>
            {page.calculator_heading || 'Interactive Impact Estimator'}
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
            Slide to see what your monthly contribution achieves on the ground:
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <span style={{ fontSize: 32, fontWeight: 700 }}>${calcAmount}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>per month</span>
          </div>
          <input
            type="range"
            min="15"
            max="500"
            step="5"
            value={calcAmount}
            onChange={(e) => setCalcAmount(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)', marginBottom: 18 }}
            aria-label="Monthly contribution amount"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div style={{ background: 'var(--bg-stone)', padding: 12, borderRadius: 14 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{Math.round(calcAmount * 0.45)}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Native saplings planted</div>
            </div>
            <div style={{ background: 'var(--bg-stone)', padding: 12, borderRadius: 14 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{Math.round(calcAmount * 1.8)} kg</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Lagoon plastic extracted</div>
            </div>
          </div>
          <button
            type="button"
            className="btn-primary-lime"
            style={{ width: '100%' }}
            onClick={() => {
              setAmount(calcAmount);
              setTierName('Custom Impact Pledge');
              setActiveTab('donate');
              document.getElementById('contribution-forms')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Pledge ${calcAmount}/mo →
          </button>
        </div>
      </section>

      {/* Contribution Tiers Collection */}
      <Reveal>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 8 }}>Stewardship Tiers</h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>{page.calculator_note}</p>
        </div>
        <div className="cards-grid-3">
          {tiers.map((tier) => (
            <div key={tier.id} className={`surface-card ${tier.featured ? 'featured' : ''}`}>
              <div className="surface-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 17, fontWeight: 600 }}>{tier.name}</span>
                  {tier.featured && <span className="page-eyebrow-pill" style={{ marginBottom: 0 }}>Most Popular</span>}
                </div>
                <div style={{ fontSize: 34, fontWeight: 700 }}>
                  ${tier.amount}
                  <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}> / {tier.frequency}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-main)' }}>{tier.impact_metric}</p>
                <ul style={{ paddingLeft: 18, fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
                  {(tier.perks || []).map((perk, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{perk}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="btn-primary-lime"
                  style={{ width: '100%', marginTop: 12 }}
                  onClick={() => handleSelectTier(tier)}
                >
                  Select {tier.name} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Interactive Forms Section (Donation Pledge + Volunteer Signup) */}
      <Reveal>
        <section id="contribution-forms" style={{ marginBottom: 64 }}>
          <div className="filter-pills" style={{ marginBottom: 24 }}>
            <button
              type="button"
              className={`filter-pill ${activeTab === 'donate' ? 'active' : ''}`}
              onClick={() => setActiveTab('donate')}
            >
              💚 {page.donation_form_heading || 'Pledge a Direct Contribution'}
            </button>
            <button
              type="button"
              className={`filter-pill ${activeTab === 'volunteer' ? 'active' : ''}`}
              onClick={() => setActiveTab('volunteer')}
            >
              ⛺ {page.volunteer_form_heading || 'Apply for Field Volunteering'}
            </button>
          </div>

          {activeTab === 'donate' ? (
            <div className="form-card">
              <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 18 }}>
                {page.donation_form_heading || 'Pledge a Direct Contribution'}
              </h3>
              {donSuccess && (
                <div style={{ background: 'var(--primary)', padding: 14, borderRadius: 12, marginBottom: 18, fontSize: 13.5, fontWeight: 600 }}>
                  ✓ Thank you! Your contribution pledge has been logged in our conservation ledger.
                </div>
              )}
              <form onSubmit={handleDonationSubmit}>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="donor-name">Full Name *</label>
                    <input
                      id="donor-name"
                      type="text"
                      required
                      className="form-input"
                      placeholder="Dr. Elena Rostova"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="donor-email">Email Address *</label>
                    <input
                      id="donor-email"
                      type="email"
                      required
                      className="form-input"
                      placeholder="elena@biosphere.org"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="donor-amount">Amount (USD) *</label>
                    <input
                      id="donor-amount"
                      type="number"
                      min="5"
                      required
                      className="form-input"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="donor-freq">Frequency</label>
                    <select
                      id="donor-freq"
                      className="form-select"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    >
                      <option value="monthly">Monthly Stewardship</option>
                      <option value="one-time">One-Time Grant</option>
                      <option value="annual">Annual Patronage</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="donor-tier">Selected Tier</label>
                    <input
                      id="donor-tier"
                      type="text"
                      className="form-input"
                      value={tierName}
                      onChange={(e) => setTierName(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="donor-focus">Ecological Focus Area</label>
                    <select
                      id="donor-focus"
                      className="form-select"
                      value={focusArea}
                      onChange={(e) => setFocusArea(e.target.value)}
                    >
                      <option value="Ocean Pollution">Ocean & Lagoon Pollution</option>
                      <option value="Glacier Melting">Glacier & Cryosphere Preservation</option>
                      <option value="Forest Clearance">Arid & Montane Reforestation</option>
                      <option value="GHG Emissions">Atmospheric Carbon & Solar Microgrids</option>
                      <option value="Where Needed Most">Where Needed Most</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="donor-notes">Dedication or Field Instructions (Optional)</label>
                  <textarea
                    id="donor-notes"
                    rows="3"
                    className="form-textarea"
                    placeholder="Optional notes for our field dispatch team…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary-lime" disabled={donSubmitting}>
                  {donSubmitting ? 'Recording Pledge…' : `Confirm $${amount} (${frequency}) Pledge →`}
                </button>
              </form>
            </div>
          ) : (
            <div className="form-card">
              <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 18 }}>
                {page.volunteer_form_heading || 'Apply for Field Volunteering'}
              </h3>
              {volSuccess && (
                <div style={{ background: 'var(--primary)', padding: 14, borderRadius: 12, marginBottom: 18, fontSize: 13.5, fontWeight: 600 }}>
                  ✓ Your volunteer expedition application has been received!
                </div>
              )}
              <form onSubmit={handleVolunteerSubmit}>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="vol-name">Full Name *</label>
                    <input
                      id="vol-name"
                      type="text"
                      required
                      className="form-input"
                      placeholder="Camila Rojas"
                      value={volName}
                      onChange={(e) => setVolName(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="vol-email">Email Address *</label>
                    <input
                      id="vol-email"
                      type="email"
                      required
                      className="form-input"
                      placeholder="camila@ecology.org"
                      value={volEmail}
                      onChange={(e) => setVolEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="vol-phone">Phone / WhatsApp</label>
                    <input
                      id="vol-phone"
                      type="tel"
                      className="form-input"
                      placeholder="+56 9 8741 2309"
                      value={volPhone}
                      onChange={(e) => setVolPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="vol-init">Target Initiative</label>
                    <select
                      id="vol-init"
                      className="form-select"
                      value={volInitiative}
                      onChange={(e) => setVolInitiative(e.target.value)}
                    >
                      {initiatives.map((init) => (
                        <option key={init.id} value={init.title}>
                          {init.title} ({init.event_date})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="vol-avail">Preferred Expedition Window</label>
                  <input
                    id="vol-avail"
                    type="text"
                    className="form-input"
                    value={volAvailability}
                    onChange={(e) => setVolAvailability(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="vol-skills">Relevant Field Skills, Languages, or Certifications</label>
                  <textarea
                    id="vol-skills"
                    rows="3"
                    className="form-textarea"
                    placeholder="First aid, hydrology sampling, photography, trail restoration…"
                    value={volSkills}
                    onChange={(e) => setVolSkills(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary-lime" disabled={volSubmitting}>
                  {volSubmitting ? 'Submitting Application…' : 'Submit Volunteer Application →'}
                </button>
              </form>
            </div>
          )}
        </section>
      </Reveal>

      {/* FAQ Accordion */}
      <Reveal>
        <h2 style={{ fontSize: 28, fontWeight: 500, textAlign: 'center', marginBottom: 24 }}>
          Frequently Asked Questions
        </h2>
        <FAQAccordion items={faqs} />
      </Reveal>
    </div>
  );
}
