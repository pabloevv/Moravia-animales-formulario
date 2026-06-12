import { useMemo } from 'react';

const COLORS = ['#ff8a05', '#ff7e00', '#5562bf', '#ffffff', '#ffcb8d', '#8d96d4'];

/** One-shot CSS confetti burst (≈26 pieces). No deps, fires on mount. */
export function Confetti({ count = 26 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.25,
        duration: 2.6 + Math.random() * 1.6,
        rotate: Math.random() * 360,
      })),
    [count],
  );

  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
