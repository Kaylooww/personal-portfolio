"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { buttonClasses } from "./ButtonLink";

interface PdfPreviewProps {
  src: string;
  title: string;
  interactive?: boolean;
}

/** Loads PDF.js only when a document enters the viewport. All assets are self-hosted. */
export function PdfPreview({ src, title, interactive = false }: PdfPreviewProps) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "200px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} className="min-w-0 overflow-hidden rounded-control bg-paper-shade">
      {visible ? <PdfPages key={src} src={src} title={title} interactive={interactive} /> : <p className="p-6 text-center text-sm text-navy-700">PDF document</p>}
    </div>
  );
}

function PdfPages({ src, title, interactive }: PdfPreviewProps) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    let task: PDFDocumentLoadingTask | undefined;
    async function load() {
      try {
        const library = await import("pdfjs-dist");
        if (cancelled) return;
        const assets = `/pdfjs/${library.version}/`;
        library.GlobalWorkerOptions.workerSrc = `${assets}pdf.worker.min.mjs`;
        task = library.getDocument({ url: src, cMapUrl: `${assets}cmaps/`, cMapPacked: true, standardFontDataUrl: `${assets}standard_fonts/`, wasmUrl: `${assets}wasm/` });
        const document = await task.promise;
        if (!cancelled) setPdf(document);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    void load();
    return () => {
      cancelled = true;
      void task?.destroy();
    };
  }, [src]);

  if (error) return <p className="p-6 text-center text-sm text-navy-700">PDF preview unavailable. Open the milestone’s PDF link to read it.</p>;
  if (!pdf) return <p role="status" className="p-6 text-center text-sm text-navy-700">Loading PDF…</p>;

  return (
    <div>
      <PdfCanvas key={page} pdf={pdf} page={page} title={title} interactive={interactive} />
      {interactive && pdf.numPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-paper-edge p-3">
          <button type="button" className={buttonClasses("secondary", "md", "px-3 text-xs")} disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous PDF page">Previous</button>
          <p aria-live="polite" className="text-sm font-bold text-navy-700">{page} / {pdf.numPages}</p>
          <button type="button" className={buttonClasses("secondary", "md", "px-3 text-xs")} disabled={page === pdf.numPages} onClick={() => setPage(page + 1)} aria-label="Next PDF page">Next</button>
        </div>
      )}
    </div>
  );
}

function PdfCanvas({ pdf, page, title, interactive }: { pdf: PDFDocumentProxy; page: number; title: string; interactive?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let task: RenderTask | undefined;
    async function render() {
      try {
        const documentPage = await pdf.getPage(page);
        const canvas = ref.current;
        if (cancelled || !canvas) return;
        const initial = documentPage.getViewport({ scale: 1 });
        const viewport = documentPage.getViewport({ scale: Math.min((interactive ? 1400 : 700) / initial.width, 2) });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        task = documentPage.render({ canvas, viewport });
        await task.promise;
      } catch {
        if (!cancelled) setError(true);
      }
    }
    void render();
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [pdf, page, interactive]);

  if (error) return <p className="p-6 text-sm text-navy-700">This page could not be displayed. Use the PDF link to open the document.</p>;
  return <canvas ref={ref} role="img" aria-label={`${title}, PDF page ${page}`} className={interactive ? "mx-auto max-h-[65dvh] w-full object-contain" : "aspect-[8/5] w-full object-contain"} />;
}
