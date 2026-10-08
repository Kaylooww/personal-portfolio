interface NightSkyProps {
  moonX?: number;
  moonY?: number;
  moonRadius?: number;
}

/** Extra night artwork, shown by CSS without a client-side theme dependency. */
export function NightSky({ moonX = 1250, moonY = 160, moonRadius = 35 }: NightSkyProps) {
  return (
    <g className="scene-night-only">
      <g fill="#d5e7f2">
        {[
          [140, 130, 1.7], [320, 80, 2], [475, 235, 1.5], [540, 120, 2.2],
          [650, 55, 1.5], [730, 205, 1.8], [840, 100, 2.3], [940, 255, 1.5],
          [1030, 55, 1.8], [1090, 195, 2], [1170, 295, 1.5], [1320, 75, 2.2],
          [1455, 225, 1.9], [1540, 105, 1.5], [380, 315, 1.6], [1530, 360, 1.8],
        ].map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} opacity="0.75" />)}
      </g>
      <circle cx={moonX} cy={moonY} r={moonRadius * 2.2} fill="#b9d7ee" opacity="0.035" />
      <circle cx={moonX} cy={moonY} r={moonRadius * 1.5} fill="#b9d7ee" opacity="0.06" />
      <circle cx={moonX} cy={moonY} r={moonRadius} fill="#e3e9da" />
      <circle cx={moonX - moonRadius * 0.27} cy={moonY + moonRadius * 0.15} r={moonRadius * 0.22} fill="#a7b9ba" opacity="0.3" />
      <circle cx={moonX + moonRadius * 0.25} cy={moonY - moonRadius * 0.3} r={moonRadius * 0.13} fill="#a7b9ba" opacity="0.24" />
    </g>
  );
}
