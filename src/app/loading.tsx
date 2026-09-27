export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-dvh items-center justify-center">
      <p className="font-handwritten animate-pulse text-hand-lg text-navy-700">Preparing expedition…</p>
    </div>
  );
}
