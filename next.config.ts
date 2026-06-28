import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["*.space-z.ai", "*.chatglm.cn"],
  // COEP/COOP headers — the original site uses require-corp + same-origin
  // for SharedArrayBuffer/Web Audio worklets. However that breaks Vimeo
  // iframes in Master Class. We disable COEP here so the iframe loads;
  // the audio engine still works (just without SharedArrayBuffer, which
  // the app gracefully falls back from).
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
