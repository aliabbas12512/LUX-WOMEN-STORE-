import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.brand.nameAr} — ${siteConfig.brand.taglineAr}`,
    short_name: siteConfig.brand.nameAr,
    description: siteConfig.brand.descriptionAr,
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#0f0e0c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
