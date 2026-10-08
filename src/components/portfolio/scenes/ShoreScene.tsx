import { NightSky } from "./NightSky";

/**
 * STAND-IN ARTWORK for About: a golden-hour beach camp with a turquoise sea,
 * distant ruined cliffs and palms. Replace with a painted plate when supplied.
 */
export function ShoreScene() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id="shore-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--scene-sky-top)" }} />
          <stop offset="0.6" style={{ stopColor: "var(--scene-sky-middle)" }} />
          <stop offset="1" style={{ stopColor: "var(--scene-sky-bottom)" }} />
        </linearGradient>
        <linearGradient id="shore-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--scene-sea-top)" }} />
          <stop offset="1" style={{ stopColor: "var(--scene-sea-bottom)" }} />
        </linearGradient>
        <radialGradient id="shore-sun" cx="0.18" cy="0.12" r="0.5">
          <stop offset="0" style={{ stopColor: "var(--color-paper)" }} />
          <stop offset="0.4" style={{ stopColor: "var(--color-sunset-100)", stopOpacity: 0.7 }} />
          <stop offset="1" style={{ stopColor: "var(--color-sunset-100)", stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id="shore-firelight">
          <stop stopColor="#ffbf65" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffbf65" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#shore-sky)" />
      <rect width="1600" height="900" fill="url(#shore-sun)" className="scene-day-only" />
      <NightSky moonX={1170} moonY={150} />

      <g className="fill-white animate-cloud-drift motion-reduce:animate-none" opacity="0.85">
        <ellipse cx="820" cy="150" rx="140" ry="34" />
        <ellipse cx="880" cy="126" rx="80" ry="36" />
        <ellipse cx="1300" cy="90" rx="120" ry="28" />
      </g>

      {/* Ruined cliffs across the bay */}
      <g className="fill-stone-500" opacity="0.55">
        <path d="M760 520V330l30-20 20 18 26-40 34 30v232Z" />
        <path d="M900 520V260l40-26 30 20 40-10 20 30v246Z" />
        <path d="M1060 520V300l24-12 36 18v214Z" />
      </g>
      <g className="fill-moss-600" opacity="0.6">
        <path d="M750 330c20-30 60-34 90-10-30-4-60 0-90 10ZM890 262c30-34 80-40 120-8-40-6-80-2-120 8Z" />
      </g>
      <path d="M600 460c120-40 300-60 520-40 150 14 300 50 480 40v100H600Z" className="fill-moss-600" opacity="0.35" />

      {/* Sea with a few wave glints */}
      <rect y="520" width="1600" height="130" fill="url(#shore-sea)" opacity="0.85" />
      <g className="scene-night-only" stroke="#c5dcd8" strokeLinecap="round" opacity="0.5">
        <path d="M1152 532h38m-52 14h70m-86 16h100m-118 20h135m-158 22h176m-200 22h220" strokeWidth="3" />
      </g>
      <g className="stroke-white" strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <path d="M700 560h60M880 585h90M1150 555h70M1320 600h60M560 610h80" />
      </g>

      {/* Sand and rocks */}
      <path d="M0 640c300-30 600-20 900 0s520 10 700-6v266H0Z" className="fill-sunset-100" />
      <path d="M0 700c400-20 800-10 1600 10v190H0Z" className="fill-paper-shade" />
      <g className="fill-stone-500" opacity="0.8">
        <ellipse cx="760" cy="700" rx="70" ry="26" />
        <ellipse cx="1180" cy="690" rx="50" ry="18" />
        <ellipse cx="420" cy="760" rx="90" ry="30" />
      </g>

      {/* Campfire */}
      <ellipse className="scene-night-only" cx="700" cy="755" rx="185" ry="100" fill="url(#shore-firelight)" />
      <g transform="translate(700 760)">
        <path d="M-30 20 30 0M-30 0l60 20" className="stroke-wood-700" strokeWidth="8" strokeLinecap="round" />
        <path d="M0-40c14 16 18 30 8 42-4-10-10-12-10-12s-2 8-8 12C-18-10-10-24 0-40Z" fill="#f5a14b" />
        <path d="M0-22c7 10 8 18 0 23-7-7-5-15 0-23Z" fill="#ffe3a0" />
      </g>

      {/* Palms framing the scene */}
      <g>
        <path d="M150 900c10-240 40-440 110-620" className="stroke-wood-700" strokeWidth="22" strokeLinecap="round" fill="none" />
        <g className="fill-moss-600">
          <path d="M262 278c-80-30-160-10-220 50 70-20 140-30 220-50Z" />
          <path d="M262 278c20-80 80-130 170-140-60 40-110 90-170 140Z" />
          <path d="M262 278c80-10 160 30 200 110-60-50-130-80-200-110Z" />
          <path d="M262 278c-40-60-110-90-190-80 70 20 130 50 190 80Z" />
        </g>
        <path d="M1480 900c-10-200-40-380-100-540" className="stroke-wood-700" strokeWidth="18" strokeLinecap="round" fill="none" />
        <g className="fill-moss-600">
          <path d="M1380 360c70-30 150-20 210 30-70-10-140-20-210-30Z" />
          <path d="M1380 360c-20-70-80-110-160-120 60 30 110 70 160 120Z" />
          <path d="M1380 360c-70 0-140 40-170 110 50-50 110-80 170-110Z" />
        </g>
      </g>
    </svg>
  );
}
