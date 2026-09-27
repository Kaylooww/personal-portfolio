/**
 * STAND-IN ARTWORK for Skills: misty jungle cliffs with waterfalls seen from a
 * wooden lookout deck. Replace with a painted plate when supplied.
 */
export function JungleScene() {
  const pillars = [
    { x: 520, w: 150, top: 180, tone: "fill-moss-600", o: 0.45 },
    { x: 760, w: 120, top: 250, tone: "fill-moss-600", o: 0.35 },
    { x: 980, w: 190, top: 130, tone: "fill-moss-700", o: 0.45 },
    { x: 1240, w: 140, top: 220, tone: "fill-moss-600", o: 0.4 },
  ];

  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id="jungle-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-blue-300)" }} />
          <stop offset="0.65" style={{ stopColor: "var(--color-blue-50)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-moss-100)" }} />
        </linearGradient>
        <linearGradient id="jungle-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-white)", stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: "var(--color-white)", stopOpacity: 0.9 }} />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#jungle-sky)" />
      <g className="fill-white animate-cloud-drift motion-reduce:animate-none" opacity="0.8">
        <ellipse cx="700" cy="110" rx="160" ry="36" />
        <ellipse cx="1350" cy="80" rx="140" ry="30" />
      </g>

      {/* Cliff pillars, each with a waterfall and a canopy crown */}
      {pillars.map((p) => (
        <g key={p.x}>
          <path
            d={`M${p.x} 900V${p.top + 30}c10-20 ${p.w * 0.3}-34 ${p.w * 0.5}-30s${p.w * 0.4} 10 ${p.w * 0.5} 34V900Z`}
            className={p.tone}
            opacity={p.o}
          />
          <path
            d={`M${p.x - 20} ${p.top + 40}c30-50 ${p.w * 0.6}-60 ${p.w + 40} 0-40-16-${p.w}-16-${p.w + 40} 0Z`}
            className="fill-moss-600"
            opacity={p.o + 0.2}
          />
          <rect x={p.x + p.w * 0.45} y={p.top + 60} width="10" height={900 - p.top} className="fill-white" opacity="0.75" />
        </g>
      ))}
      <rect y="420" width="1600" height="300" fill="url(#jungle-mist)" />

      {/* Rope bridge */}
      <path d="M430 560c200 50 420 50 620 0" className="stroke-wood-700" strokeWidth="5" fill="none" />
      <path d="M430 540c200 50 420 50 620 0" className="stroke-wood-500" strokeWidth="3" fill="none" />

      {/* Lookout deck */}
      <path d="M0 740h1600v160H0Z" className="fill-wood-500" />
      <g className="stroke-wood-700" strokeWidth="3" opacity="0.7">
        <path d="M0 780h1600M0 830h1600M0 875h1600" />
      </g>
      <path d="M0 700c300 30 600 30 900 10" className="stroke-wood-300" strokeWidth="7" strokeLinecap="round" fill="none" />
      {[80, 360, 640].map((x) => (
        <rect key={x} x={x} y="690" width="16" height="70" rx="4" className="fill-wood-700" />
      ))}

      {/* Foreground leaves */}
      <g className="fill-moss-700">
        <path d="M-40 520c120 20 190 110 200 260-80-80-140-170-200-260Z" />
        <path d="M-40 640c140-10 240 60 280 200-100-60-190-120-280-200Z" opacity="0.85" />
        <path d="M1640 480c-130 30-200 120-210 280 80-90 150-180 210-280Z" />
      </g>
      <g className="fill-moss-600">
        <path d="M1640 620c-150 0-250 80-280 220 100-70 190-140 280-220Z" />
        <path d="M0 0c90 60 120 150 90 260C60 170 20 90 0 0Z" />
        <path d="M1600 0c-80 70-100 160-60 260 20-90 40-180 60-260Z" />
      </g>
    </svg>
  );
}
