/** Three short strokes radiating up-right — the "ta-da" mark after headings. */
export function Spark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <g stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" fill="none">
        <path d="M5 11 3.5 3.5" />
        <path d="m9.5 13.5 6-5.5" />
        <path d="M11 19.5h8" />
      </g>
    </svg>
  );
}
