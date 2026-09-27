/**
 * STAND-IN ARTWORK for Journey: a volcanic ridge at dusk above a sea of
 * clouds, a lava-lit crater glowing below. Replace with a painted plate when supplied.
 */
export function RidgeScene() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id="ridge-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-navy-500)" }} />
          <stop offset="0.45" style={{ stopColor: "var(--color-blue-300)" }} />
          <stop offset="0.8" style={{ stopColor: "var(--color-sunset-100)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-sunset-500)" }} />
        </linearGradient>
        <radialGradient id="ridge-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "var(--color-sunset-500)", stopOpacity: 0.9 }} />
          <stop offset="1" style={{ stopColor: "var(--color-sunset-500)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#ridge-sky)" />
      <circle cx="1480" cy="120" r="90" fill="url(#ridge-glow)" />

      {/* Distant range */}
      <path d="M500 520 700 330l90 70 110-150 120 120 90-80 160 140 130-110 200 200Z" className="fill-navy-500" opacity="0.55" />

      {/* Sea of clouds */}
      <g className="fill-white animate-cloud-drift motion-reduce:animate-none" opacity="0.75">
        <ellipse cx="400" cy="560" rx="360" ry="60" />
        <ellipse cx="900" cy="600" rx="400" ry="70" />
        <ellipse cx="1400" cy="560" rx="320" ry="60" />
      </g>

      {/* Crater lake with lava rim */}
      <ellipse cx="620" cy="650" rx="260" ry="46" className="fill-navy-700" opacity="0.8" />
      <ellipse cx="620" cy="650" rx="240" ry="36" className="fill-blue-300" opacity="0.5" />
      <path d="M380 650c60-30 140-40 240-40s180 10 240 40" className="stroke-sunset-500" strokeWidth="6" fill="none" opacity="0.8" />
      <ellipse cx="620" cy="640" rx="300" ry="80" fill="url(#ridge-glow)" opacity="0.35" />

      {/* Rocky ridge rising right toward the summit flag */}
      <path d="M700 900 900 700l120 30 140-160 110 20 150-230 110-120 170 60v600Z" className="fill-navy-800" opacity="0.9" />
      <path d="M1430 240V160l50 18-50 18" className="stroke-flag-red" strokeWidth="6" fill="none" strokeLinejoin="round" />

      {/* Dark foreground rocks */}
      <path d="M0 900V700l120-40 90 50 130-20 110 80 150 20 100 110Z" className="fill-navy-900" />
      <path d="M0 680c60-40 80-120 40-200 60 40 110 110 100 200Z" className="fill-stone-700" opacity="0.6" />
    </svg>
  );
}
