import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["*.space-z.ai", "*.chatglm.cn"],
  // The original roland50.studio is a Next.js static export. Its HTML
  // references /_next/static/chunks/... — but we can't put files in
  // public/_next/ (Next.js reserves that route). So we store the original
  // bundle in public/_roland50_next/ and rewrite /_next/* → /_roland50_next/*
  // so the original HTML works unchanged.
  async rewrites() {
    return [
      {
        source: "/_next/static/:path*",
        destination: "/_roland50_next/static/:path*",
      },
    ];
  },
  // COOP/CORP headers — the original uses COEP require-corp for
  // SharedArrayBuffer, but that breaks Vimeo iframes in Master Class.
  // We disable COEP so Vimeo loads; audio still works.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
