// next.config.mjs
// Security headers for Next.js (App Router, 14+). Drop into the project root,
// or copy the `headers()` function into an existing config.
//
// CSP starts in Report-Only so you can watch the browser console for
// violations before enforcing. When clean, rename the key to
// "Content-Security-Policy" and delete the report-only line.
//
// Adjust the allowlists in `csp` for the third parties this site actually uses
// (analytics, fonts, embeds). Every domain you add is a trust decision.

const isProd = process.env.NODE_ENV === "production";

const csp = [
  "default-src 'self'",
  // Next.js needs 'unsafe-inline' for its runtime unless you use nonces.
  // 'unsafe-eval' is only needed in dev for HMR.
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Restrict remote images to hosts you control.
    remotePatterns: [
      // { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
