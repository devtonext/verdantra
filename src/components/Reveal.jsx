import React, { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, className = '', variant = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    // Stagger direct card/row children inside this section
    const staggerTargets = el.querySelectorAll(
      '.pillar-pill, .initiative-row, .problem-card, .impact-metric-card, .surface-card, .stat-card, .faq-item, .mission-vignette'
    );
    staggerTargets.forEach((child, idx) => {
      child.classList.add('reveal-item');
      child.style.setProperty('--reveal-delay', `${Math.min(idx * 90, 450)}ms`);
    });

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          staggerTargets.forEach((child) => child.classList.add('visible'));
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const variantClass = variant ? `reveal-${variant}` : '';
  return (
    <div
      ref={ref}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      className={`reveal-block ${variantClass} ${visible ? 'visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
