export function SkipLink({ targetId = "main" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="surface-paper fixed left-4 top-4 z-(--z-toast) -translate-y-24 rounded-control px-4 py-2 font-extrabold text-navy-900 transition-trail transition-transform focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
