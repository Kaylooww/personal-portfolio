import { ExpeditionFlag } from "./ExpeditionFlag";
import { NightSky } from "./NightSky";

/**
 * STAND-IN ARTWORK for the Summit: a peach sunset over a sea of clouds, seen
 * from a grassy summit where the expedition flag is planted. Replace with a
 * painted plate when supplied.
 */
export function SunsetScene() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id="sunset-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--scene-sky-top)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--scene-sky-middle)" }} />
          <stop offset="1" style={{ stopColor: "var(--scene-sky-bottom)" }} />
        </linearGradient>
        <radialGradient id="sunset-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "var(--color-paper)" }} />
          <stop offset="0.25" style={{ stopColor: "var(--color-paper)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-sunset-500)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#sunset-sky)" />
      <circle cx="1100" cy="420" r="260" fill="url(#sunset-sun)" className="scene-day-only" />
      <NightSky moonX={1110} moonY={310} moonRadius={48} />

      {/* High cloud streaks */}
      <g className="fill-sunset-600" opacity="0.35">
        <ellipse cx="1300" cy="180" rx="260" ry="26" />
        <ellipse cx="1380" cy="230" rx="180" ry="18" />
        <ellipse cx="600" cy="110" rx="220" ry="20" />
      </g>

      {/* Distant peaks */}
      <path d="M520 560 700 400l80 60 90-110 120 110 70-40 160 140Z" className="fill-navy-500" opacity="0.45" />
      <path d="M1150 580 1330 440l80 50 60-40 130 130Z" className="fill-navy-500" opacity="0.35" />

      {/* Sea of clouds, catching the light */}
      <g className="fill-paper animate-cloud-drift motion-reduce:animate-none" opacity="0.9">
        <ellipse cx="700" cy="610" rx="420" ry="60" />
        <ellipse cx="1250" cy="640" rx="460" ry="70" />
        <ellipse cx="1550" cy="590" rx="200" ry="40" />
      </g>
      <g className="fill-sunset-100" opacity="0.9">
        <ellipse cx="900" cy="700" rx="600" ry="70" />
        <ellipse cx="1500" cy="720" rx="300" ry="60" />
      </g>

      {/* Grassy summit on the right (text sits left) and the planted flag */}
      <g transform="translate(1600 0) scale(-1 1)">
        <path d="M0 900V560c120-30 260-10 380 40s240 110 360 170 220 90 280 130Z" className="fill-moss-600" />
        <path d="M0 900V640c140-10 260 30 380 90s220 110 300 170Z" className="fill-moss-700" />
        <g className="fill-stone-500" opacity="0.8">
          <ellipse cx="300" cy="640" rx="50" ry="20" />
          <ellipse cx="520" cy="720" rx="40" ry="16" />
        </g>
      </g>
      <ExpeditionFlag x={1230} y={620} scale={2.2} tone="blue" />
    </svg>
  );
}
