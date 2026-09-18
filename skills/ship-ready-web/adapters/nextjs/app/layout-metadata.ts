// app/layout-metadata.ts
// Import and spread into `export const metadata` in app/layout.tsx.
// Per-page files override title and description via the same Metadata type.

import type { Metadata, Viewport } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "Site Name";
const defaultDescription = "One sentence that says what this site is for and who it is for.";

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s | ${siteName}` },
  description: defaultDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: defaultDescription,
    url: siteUrl,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: siteName }],
  },
  twitter: { card: "summary_large_image", title: siteName, description: defaultDescription, images: ["/og.jpg"] },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export const baseViewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};
