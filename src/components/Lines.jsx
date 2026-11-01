import React from 'react';

export default function Lines({ text = '' }) {
  if (!text) return null;
  const parts = String(text).split(/\n|\\n/);
  return (
    <>
      {parts.map((part, idx) => (
        <React.Fragment key={idx}>
          {part}
          {idx < parts.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}
