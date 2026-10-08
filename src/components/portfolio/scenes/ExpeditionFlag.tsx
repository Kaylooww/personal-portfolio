interface ExpeditionFlagProps {
  x: number;
  y: number;
  scale?: number;
  tone?: "red" | "blue";
}

/** A planted cloth pennant with a stitched edge, folded tail and mountain crest. */
export function ExpeditionFlag({ x, y, scale = 1, tone = "red" }: ExpeditionFlagProps) {
  const fabric = tone === "red" ? "#bf5746" : "#285c8a";
  const fold = tone === "red" ? "#87392f" : "#183e66";

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0v-120" stroke="#c5aa7a" strokeWidth="5" strokeLinecap="round" />
      <path d="M-1 0v-117" stroke="#55493a" strokeWidth="2" strokeLinecap="round" />
      <circle cy="-123" r="4" fill="#e1c797" />
      <g>
        <path d="M3-116c24-9 42 7 69-1l-9 26 12 26c-29 9-48-9-72 0Z" fill={fabric} />
        <path d="M50-113c7 0 14-1 22-4l-9 26 12 26c-10 3-17 3-24 1Z" fill={fold} />
        <path d="M8-111c16-4 28 3 40 3M8-71c16-4 28 3 40 3" stroke="#f4d3a9" strokeWidth="1" strokeDasharray="2 3" opacity="0.65" fill="none" />
        <path d="m16-83 11-17 8 11 6-7 10 13Z" fill="#fff1d6" />
        <path d="m24-95 3-5 4 6-4-2Z" fill={fabric} />
        <path d="M5-114v47" stroke="#f6c9a1" strokeWidth="2" opacity="0.4" />
      </g>
      <path d="M-8 0H8" stroke="#879297" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}
