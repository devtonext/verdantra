import React, { useEffect, useState } from 'react';

export default function Counter({ value = 0, suffix = '' }) {
  const target = Number(value) || 0;
  const [count, setCount] = useState(target);

  useEffect(() => {
    let frame;
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const formatted =
    target >= 1000000
      ? `${(count / 1000000).toFixed(1)}M`
      : count.toLocaleString();

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
}
