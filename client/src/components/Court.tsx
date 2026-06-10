// Faint top-down volleyball court behind everything. Inline SVG, scales to fill.
export function Court() {
  const line = 'rgba(255,255,255,0.13)';
  return (
    <svg
      className="court"
      viewBox="0 0 90 160"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* playing surface tint */}
      <rect x="9" y="14" width="72" height="132" fill="rgba(255,138,5,0.035)" />

      <g stroke={line} fill="none" strokeWidth="0.6">
        {/* boundary */}
        <rect x="9" y="14" width="72" height="132" />
        {/* attack (3 m) lines */}
        <line x1="9" y1="58" x2="81" y2="58" />
        <line x1="9" y1="102" x2="81" y2="102" />
      </g>

      {/* center line + net */}
      <line x1="9" y1="80" x2="81" y2="80" stroke={line} strokeWidth="1" />
      <line
        x1="9"
        y1="80"
        x2="81"
        y2="80"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="4"
        strokeDasharray="1.4 1.6"
      />
      {/* net posts */}
      <line x1="6" y1="74" x2="6" y2="86" stroke={line} strokeWidth="0.8" />
      <line x1="84" y1="74" x2="84" y2="86" stroke={line} strokeWidth="0.8" />
    </svg>
  );
}
