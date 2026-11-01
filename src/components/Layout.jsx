import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ToastContainer from './Toast.jsx';

export function syncSlidingPills() {
  if (typeof document === 'undefined') return;
  const groups = document.querySelectorAll('.filter-pills, .nav-group-left');
  groups.forEach((group) => {
    const activeBtn = group.querySelector('.filter-pill.active, .nav-pill.active');
    let indicator = group.querySelector('.sliding-pill-bg');
    if (!activeBtn) {
      if (indicator) indicator.style.opacity = '0';
      return;
    }
    group.classList.add('has-slider');
    if (!indicator) {
      indicator = document.createElement('span');
      indicator.className = 'sliding-pill-bg';
      group.insertBefore(indicator, group.firstChild);
    }
    indicator.style.opacity = '1';
    indicator.style.width = `${activeBtn.offsetWidth}px`;
    indicator.style.height = `${activeBtn.offsetHeight}px`;
    indicator.style.transform = `translate3d(${activeBtn.offsetLeft}px, ${activeBtn.offsetTop}px, 0)`;
  });
}

export default function Layout() {
  const { pathname, search } = useLocation();
  const [scrollPct, setScrollPct] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    requestAnimationFrame(syncSlidingPills);
  }, [pathname, search]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      setScrollPct(max > 0 ? (scrolled / max) * 100 : 0);
      setShowTop(scrolled > 420);
    };
    const onClick = () => {
      requestAnimationFrame(() => requestAnimationFrame(syncSlidingPills));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncSlidingPills);
    document.addEventListener('click', onClick);
    requestAnimationFrame(syncSlidingPills);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', syncSlidingPills);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress-bar" style={{ width: `${scrollPct}%` }} />
      <div className="site-frame">
        <Header />
        <main id="main-content" className="container-inner">
          <Outlet />
        </main>
        <Footer />
      </div>
      {showTop && (
        <button
          type="button"
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
      <ToastContainer />
    </>
  );
}
