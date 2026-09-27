/**
 * STAND-IN ARTWORK for Projects: a warm canyon camp under a blue sky, with a
 * dotted trail climbing a far peak. Replace with a painted plate when supplied.
 */
export function CanyonScene() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id="canyon-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-blue-300)" }} />
          <stop offset="0.7" style={{ stopColor: "var(--color-blue-50)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-sunset-100)" }} />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#canyon-sky)" />
      <g className="fill-white animate-cloud-drift motion-reduce:animate-none" opacity="0.85">
        <ellipse cx="620" cy="150" rx="170" ry="36" />
        <ellipse cx="690" cy="124" rx="90" ry="38" />
        <ellipse cx="1150" cy="220" rx="130" ry="28" />
      </g>

      {/* Far peak with the route to its flag */}
      <path d="M1180 520 1370 120l70 90 40-40 120 350Z" className="fill-stone-100" />
      <path d="M1370 120l-40 90 30-10 20 20 30-20Z" className="fill-white" />
      <path
        d="M1250 470c40-30 90-40 80-90s-60-60-20-110 60-40 60-100"
        className="stroke-blue-500"
        strokeWidth="5"
        strokeDasharray="1 16"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M1370 120V70l40 14-40 14" className="stroke-flag-red" strokeWidth="5" fill="none" strokeLinejoin="round" />

      {/* Layered mesas */}
      <path d="M0 560V380l90-20 40 30h120l30-60h140l20 70 80 10v150Z" className="fill-sunset-500" opacity="0.45" />
      <path d="M600 560V300l60-30h140l40 50 60-10 30 250Z" className="fill-sunset-600" opacity="0.4" />
      <path d="M0 640V480l140-20 60 40h200l60-40 200 10 40 60 200-20 80 40 160-10 120 50 140-10v60Z" className="fill-sunset-600" opacity="0.55" />
      <path d="M0 700c200-40 500-50 800-30s600 20 800-10v240H0Z" className="fill-wood-500" opacity="0.8" />
      <path d="M0 780c300-30 700-30 1600 0v120H0Z" className="fill-wood-700" opacity="0.85" />

      {/* Tent and lantern glow */}
      <g transform="translate(1320 640)">
        <path d="M0 80 80-20l80 100Z" className="fill-sunset-500" />
        <path d="M80-20 64 80h32Z" className="fill-sunset-700" />
      </g>
      <circle cx="1280" cy="700" r="36" className="fill-sunset-100" opacity="0.5" />

      {/* Rope fence */}
      <path d="M0 760c200 30 400 30 620 0" className="stroke-wood-300" strokeWidth="6" fill="none" strokeLinecap="round" />
      {[40, 320, 600].map((x) => (
        <rect key={x} x={x} y="730" width="18" height="90" rx="4" className="fill-wood-900" />
      ))}
    </svg>
  );
}
