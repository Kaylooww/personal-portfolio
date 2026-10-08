import { NightSky } from "./NightSky";

/**
 * STAND-IN ARTWORK for Milestones: a banner-hung citadel glowing in a golden
 * sunset, a lit stone path winding up to it. Replace with a painted plate when supplied.
 */
export function CitadelScene() {
  const banners = [
    { x: 1030, tone: "fill-flag-red" },
    { x: 1150, tone: "fill-blue-600" },
    { x: 1290, tone: "fill-flag-red" },
    { x: 1420, tone: "fill-blue-600" },
  ];

  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id="citadel-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--scene-sky-top)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--scene-sky-middle)" }} />
          <stop offset="1" style={{ stopColor: "var(--scene-sky-bottom)" }} />
        </linearGradient>
        <radialGradient id="citadel-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "var(--color-paper)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-sunset-100)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#citadel-sky)" />
      <circle cx="1230" cy="140" r="220" fill="url(#citadel-glow)" className="scene-day-only" />
      <NightSky moonX={1450} moonY={145} moonRadius={41} />
      <g className="fill-white animate-cloud-drift motion-reduce:animate-none" opacity="0.7">
        <ellipse cx="500" cy="200" rx="200" ry="40" />
        <ellipse cx="580" cy="170" rx="110" ry="42" />
        <ellipse cx="1500" cy="330" rx="160" ry="34" />
      </g>

      {/* Distant peaks */}
      <path d="M300 620 480 380l90 100 110-160 150 300Z" className="fill-sunset-600" opacity="0.3" />

      {/* Citadel */}
      <g className="fill-stone-100">
        <path d="M940 640V420h60v-40h40v40h70V300h40v-50h60v50h40v120h80v-60h40v60h80v220Z" />
        <path d="M1180 250V170h40l20-40 20 40h40v80Z" />
      </g>
      <path d="M1240 130V60" className="stroke-sunset-500" strokeWidth="6" strokeLinecap="round" />
      <circle cx="1240" cy="100" r="60" fill="url(#citadel-glow)" opacity="0.8" />
      <g fill="var(--scene-window)">
        {[980, 1060, 1140, 1330, 1410, 1480].map((x) => (
          <rect key={x} x={x} y="480" width="16" height="26" rx="8" />
        ))}
      </g>
      <g className="scene-night-only" fill="#ffd48e">
        <path d="M1164 340a10 10 0 0 1 20 0v30h-20Z" />
        <path d="M1227 198a8 8 0 0 1 16 0v26h-16Z" />
        <path d="M1215 592a25 25 0 0 1 50 0v48h-50Z" opacity="0.65" />
      </g>
      {banners.map((b) => (
        <path key={b.x} d={`M${b.x} 440h44v100l-22-14-22 14Z`} className={b.tone} />
      ))}

      {/* Clouds wrapping the base */}
      <g className="fill-white" opacity="0.85">
        <ellipse cx="1000" cy="660" rx="260" ry="50" />
        <ellipse cx="1400" cy="640" rx="260" ry="50" />
      </g>

      {/* Glowing stone path */}
      <path d="M700 900c60-80 180-120 260-160s140-70 220-110" className="stroke-sunset-500" strokeWidth="26" strokeLinecap="round" fill="none" opacity="0.35" />
      <path d="M700 900c60-80 180-120 260-160s140-70 220-110" className="stroke-paper" strokeWidth="8" strokeDasharray="18 14" strokeLinecap="round" fill="none" opacity="0.8" />

      {/* Foreground cliffs */}
      <path d="M0 900V560c60-20 120 10 170 60s90 120 170 150 180 60 240 130Z" className="fill-wood-700" opacity="0.85" />
      <path d="M1600 900V760c-80-10-160 20-230 60s-120 60-170 80Z" className="fill-wood-700" opacity="0.8" />
    </svg>
  );
}
