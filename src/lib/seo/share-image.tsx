import "server-only";
import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/queries/profile";
import { getSiteSettings } from "@/lib/queries/site-settings";

// ImageResponse cannot read CSS variables; these mirror the expedition tokens.
const palette = { paper: "#FFF9ED", edge: "#EADFC8", navy: "#0B1E4A", blue: "#1570E6", light: "#DCEBFF", wood: "#6B4933" };

export async function createShareImage() {
  const [profile, settings] = await Promise.all([getProfile(), getSiteSettings()]);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: palette.paper, color: palette.navy, padding: 48 }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", border: `3px dashed ${palette.edge}`, padding: 36 }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 5, color: palette.wood }}>THE EXPEDITION</div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 730 }}>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 700, lineHeight: 1.12 }}>{settings.site_title}</div>
            <div style={{ display: "flex", fontSize: 25, marginTop: 22, lineHeight: 1.4 }}>{shorten(profile.headline_roles.join(" / "), 100)}</div>
          </div>
          <svg width="230" height="230" viewBox="0 0 230 230">
            <circle cx="115" cy="115" r="110" fill={palette.light} />
            <path d="M10 192 96 48l86 144Z" fill={palette.blue} />
            <path d="m114 192 54-90 54 90Z" fill={palette.navy} />
            <path d="m67 105 29-48 29 48-17-9-12 13-13-13Z" fill={palette.paper} />
            <path d="M96 49V16l37 10-37 11" fill={palette.wood} />
          </svg>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 21 }}>
          <span style={{ maxWidth: 760 }}>{shorten(profile.tagline, 110)}</span>
          <span style={{ color: palette.blue, fontWeight: 700 }}>TO THE SUMMIT</span>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}

function shorten(text: string, limit: number) {
  return text.length > limit ? `${text.slice(0, limit - 3).trimEnd()}...` : text;
}
