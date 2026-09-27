/**
 * STAND-IN ARTWORK for the Airport checkpoint: a sunlit terminal looking out
 * over the runway and distant islands. Built from tokens so it stays on-brand
 * until a painted, text-free background plate is supplied (see CURRENT_STATE
 * → Open questions). Purely decorative.
 */
export function TerminalScene() {
  const mullions = [110, 400, 690, 980, 1270];
  const floorRays = [-900, -500, -150, 150, 450, 800, 1150, 1500, 1900, 2500];

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="terminal-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-blue-300)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--color-blue-100)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-blue-50)" }} />
        </linearGradient>
        <linearGradient id="terminal-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-blue-300)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-blue-500)" }} />
        </linearGradient>
        <linearGradient id="terminal-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-paper-shade)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-cream)" }} />
        </linearGradient>
      </defs>

      {/* Sky and drifting clouds */}
      <rect width="1600" height="660" fill="url(#terminal-sky)" />
      <g className="fill-white animate-cloud-drift motion-reduce:animate-none">
        <g opacity="0.95">
          <ellipse cx="260" cy="190" rx="130" ry="42" />
          <ellipse cx="330" cy="160" rx="90" ry="52" />
          <ellipse cx="200" cy="170" rx="70" ry="38" />
        </g>
        <g opacity="0.85">
          <ellipse cx="1040" cy="130" rx="150" ry="40" />
          <ellipse cx="1120" cy="100" rx="95" ry="50" />
          <ellipse cx="970" cy="112" rx="70" ry="34" />
        </g>
        <g opacity="0.7">
          <ellipse cx="1480" cy="300" rx="120" ry="30" />
          <ellipse cx="1540" cy="276" rx="70" ry="34" />
          <ellipse cx="640" cy="330" rx="110" ry="26" />
          <ellipse cx="700" cy="310" rx="60" ry="28" />
        </g>
      </g>

      {/* Distant islands, hazed back, then the sea */}
      <path
        d="M860 548c40-60 70-70 95-120 18-36 40-60 70-52 26 8 30 42 58 50 30 8 44-40 80-44 42-4 50 60 90 76 30 12 56-6 86 10 40 22 60 60 100 80H860Z"
        className="fill-blue-300"
        opacity="0.9"
      />
      <path
        d="M980 552c26-40 50-44 70-80 16-28 36-40 58-30 24 12 20 46 48 52 34 8 42-34 76-30 40 6 44 58 90 74 20 8 40 6 60 14H980Z"
        className="fill-moss-600"
        opacity="0.55"
      />
      <path d="M180 552c50-26 90-30 150-28 60 2 90 18 140 28Z" className="fill-moss-600" opacity="0.35" />
      <rect y="548" width="1600" height="70" fill="url(#terminal-sea)" opacity="0.8" />

      {/* Runway and a waiting aircraft */}
      <rect y="606" width="1600" height="54" className="fill-stone-100" />
      <path d="M0 632h1600" className="stroke-white" strokeWidth="3" strokeDasharray="40 30" />
      <g transform="translate(760 560)">
        <path d="M10 44c0-12 16-20 40-20h250c26 0 44 8 54 20-10 12-28 18-54 18H50c-24 0-40-6-40-18Z" className="fill-white" />
        <path d="M250 26 300-34h32l-26 60Z" className="fill-blue-500" />
        <path d="m300-8 8-10 10 16-6 6Z" className="fill-white" opacity="0.9" />
        <path d="M140 46 200 80h36l-40-34Z" className="fill-paper-edge" />
        <g className="fill-navy-700">
          {[70, 92, 114, 136, 158, 180, 202, 224].map((x) => (
            <circle key={x} cx={x} cy="38" r="4" />
          ))}
        </g>
        <path d="M22 38c6-6 14-8 22-8" className="stroke-navy-700" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>

      {/* Terminal glazing: ceiling, mullions, transoms */}
      <path d="M0 0h1600v58L0 86Z" className="fill-paper" />
      <path d="M0 86 1600 58v10L0 98Z" className="fill-paper-edge" />
      {mullions.map((x) => (
        <g key={x}>
          <rect x={x} y="60" width="18" height="600" className="fill-paper" />
          <rect x={x + 13} y="60" width="5" height="600" className="fill-paper-edge" />
        </g>
      ))}
      <rect y="268" width="1600" height="8" className="fill-paper" opacity="0.9" />
      <rect y="640" width="1600" height="24" className="fill-paper-edge" />

      {/* Hanging expedition banner */}
      <g transform="translate(1340 60)">
        <path d="M0 0h96v170l-48-22-48 22Z" className="fill-blue-500" />
        <path d="M14 104 38 64l24 40Z" className="fill-white" />
        <path d="M44 104 62 76l18 28Z" className="fill-white" opacity="0.75" />
      </g>

      {/* Polished floor with a blue walkway */}
      <rect y="664" width="1600" height="236" fill="url(#terminal-floor)" />
      <path d="M660 664h280l380 236H280Z" className="fill-blue-100" opacity="0.8" />
      <g className="stroke-blue-300" strokeWidth="2" opacity="0.4">
        {floorRays.map((x) => (
          <path key={x} d={`M800 664 ${x} 900`} />
        ))}
        <path d="M0 700h1600M0 752h1600M0 824h1600" />
      </g>

      {/* Planters framing the corners */}
      <g className="fill-moss-600">
        <path d="M-20 900c20-120 60-190 140-230-40 60-60 140-60 230Z" />
        <path d="M40 900c30-90 90-150 190-170-70 40-110 100-130 170Z" opacity="0.85" />
        <path d="M1620 900c-10-130-60-200-150-240 50 70 70 150 70 240Z" />
        <path d="M1560 900c-40-100-100-150-200-160 70 40 110 100 130 160Z" opacity="0.85" />
      </g>
      <g className="fill-moss-700">
        <path d="M80 900c0-70 20-120 70-160-20 50-24 110-14 160Z" />
        <path d="M1500 900c10-80-10-130-60-170 16 60 16 120 6 170Z" />
      </g>
    </svg>
  );
}
