import React, { useState } from 'react';

export default function FAQAccordion({ items = [] }) {
  const [openId, setOpenId] = useState(items[0]?.id || null);

  return (
    <div className="faq-list">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="faq-trigger"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <span className="faq-icon">+</span>
            </button>
            <div className="faq-answer-wrap" aria-hidden={!isOpen}>
              <div className="faq-answer-inner">
                <div className="faq-answer">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
