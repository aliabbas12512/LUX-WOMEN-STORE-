import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.brand.nameEn} — ${siteConfig.brand.taglineAr}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Latin-only artwork: the OG renderer has no Arabic text shaping.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0f0e0c", color: "#faf7f2", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute", left: 120, top: 70, width: 300, height: 560, borderTopLeftRadius: 150, borderTopRightRadius: 150, background: "radial-gradient(circle at 50% 40%, #efe0c4, #c9ab7c 45%, #3a2f22)" }} />
        <div style={{ position: "absolute", left: 100, top: 50, width: 340, height: 600, borderTopLeftRadius: 170, borderTopRightRadius: 170, border: "1.5px solid rgba(220,202,166,0.4)" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: 420 }}>
          <div style={{ fontSize: 132, letterSpacing: 40, fontFamily: "serif" }}>{siteConfig.brand.nameEn}</div>
          <div style={{ width: 220, height: 1, background: "#b39668", margin: "24px 0" }} />
          <div style={{ fontSize: 28, letterSpacing: 10, color: "#dccaa6" }}>MODEST FASHION HOUSE</div>
        </div>
      </div>
    ),
    size,
  );
}
