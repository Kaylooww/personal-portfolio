import localFont from "next/font/local";

/**
 * Self-hosted fonts (no runtime request to Google Fonts).
 * Display: Baloo 2 — heavy, rounded, adventurous headlines.
 * Hand:    Kalam — expedition-journal notes and subtitles.
 * Body:    Nunito — rounded, highly legible body and UI text.
 */
export const baloo = localFont({
  src: "./fonts/baloo-2-latin-wght.woff2",
  variable: "--font-baloo",
  weight: "400 800",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

export const kalam = localFont({
  src: [
    { path: "./fonts/kalam-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/kalam-latin-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-kalam",
  display: "swap",
  preload: false,
});

export const nunito = localFont({
  src: "./fonts/nunito-latin-wght.woff2",
  variable: "--font-nunito",
  weight: "200 1000",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

export const fontVariables = [baloo.variable, kalam.variable, nunito.variable].join(" ");
