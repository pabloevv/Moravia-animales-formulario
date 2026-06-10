import { Volleyball } from './Volleyball';

// Decorative slow-drifting volleyballs using the provided SVG art.
const balls = [
  { left: '6%', size: 90, dur: 26, delay: 0, variant: 1 as const },
  { left: '34%', size: 64, dur: 34, delay: 6, variant: 2 as const },
  { left: '62%', size: 110, dur: 30, delay: 3, variant: 2 as const },
  { left: '82%', size: 72, dur: 38, delay: 9, variant: 1 as const },
];

export function VolleyballBackground() {
  return (
    <>
      {balls.map((b, i) => (
        <div
          key={i}
          className="vb-drift"
          style={{
            left: b.left,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
          aria-hidden
        >
          <Volleyball size={b.size} variant={b.variant} />
        </div>
      ))}
    </>
  );
}
