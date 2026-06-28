# Roland50 Studio — Clone

Reverse-engineered clone of [roland50.studio](https://roland50.studio) — a web-based music creation platform that emulates Roland's most famous instruments (TR-808, TR-909, TR-606, TR-707, TB-303, SH-101, SP-404) built by Yuri Suzuki and Roland to celebrate Roland's 50th anniversary.

This clone serves the **actual production bundle** from the original site. No code was reimplemented — the original Next.js build, React components, Web Audio synthesis engine, sample library, and SVG instrument graphics all run unchanged.

> **Disclaimer**: Roland, TR-808, TR-909, TB-303, SH-101, SP-404, and all related marks are trademarks of Roland Corporation. This is an educational reverse-engineering exercise. All credit for the design, code, and concept goes to Yuri Suzuki, Pentagram Design, and Roland. Visit [roland50.studio](https://roland50.studio) for the original.

---

## What's inside

### 5 Routes (matching the original Next.js Pages Router)

| Route | Description |
|-------|-------------|
| `/` | Main studio app — intro overlay + instrument tabs + BPM + record |
| `/about` | About page — story of the project |
| `/masterclass` | Master Class — embedded Vimeo tutorials |
| `/privacy` | Privacy Policy (Pentagram Design Limited) |
| `/trademark` | Trademark notices |

### Instruments emulated

- **SH-101** — analog synthesizer with bender, waveform selection
- **TB-303** — bass line synth with notorious filter
- **TR-606** — drum machine (vintage samples)
- **TR-707** — digital drum machine
- **TR-808** — the legendary bass + drum machine
- **TR-909** — the legendary house/techno drum machine
- **SP-404** — sampler with delay, reverse, pitch shift

### What runs from the original bundle

- **Next.js 16** (Pages Router, static export)
- **React** components for every instrument UI
- **Web Audio API** synthesis engine (Tuna.js effects library)
- **MP3 sample library** (TR-606, TR-707, TR-808, TR-909 drum sounds, SFX)
- **SVG graphics** for every knob, button, label, and logo (170+ files)
- **Custom fonts** (LiquidCrystal, SP404Countdown, TR-909, TR606, TR707/808)
- **react-spring** animations
- **Vimeo embeds** in Master Class

### Patches applied

1. **Cloudflare Insights beacon** stripped from all 5 HTML pages (no analytics sent to original)
2. **Title and meta description** updated to indicate clone status

No auth or paywall to bypass — the original is fully free.

---

## File structure

```
public/
├── index-roland50.html              ← / route HTML shell (CF insights stripped)
├── index-roland50-about.html        ← /about HTML
├── index-roland50-masterclass.html  ← /masterclass HTML
├── index-roland50-privacy.html      ← /privacy HTML
├── index-roland50-trademark.html    ← /trademark HTML
├── card-facebook.png                ← OG image
├── card-twitter.png                 ← Twitter card
├── site.webmanifest
├── browserconfig.xml
├── sh101-grid-texture.png
├── icons/                           ← favicon variants (5 files)
└── _next/
    ├── static/
    │   ├── css/
    │   │   └── 6e2bb5504f9b76c8.css ← original compiled CSS
    │   ├── chunks/
    │   │   ├── webpack-*.js         ← Next.js runtime
    │   │   ├── framework-*.js       ← React + ReactDOM
    │   │   ├── main-*.js            ← Next.js main
    │   │   ├── pages/
    │   │   │   ├── _app-*.js
    │   │   │   ├── index-*.js       ← main studio page (619KB — the whole app)
    │   │   │   ├── about-*.js
    │   │   │   ├── masterclass-*.js
    │   │   │   ├── privacy-*.js
    │   │   │   ├── trademark-*.js
    │   │   │   ├── _error-*.js
    │   │   │   └── countdown-*.js
    │   │   ├── 166-*.js             ← Tuna.js audio effects + instrument SVGs
    │   │   ├── fb7d5399-*.js        ← react-spring + animations
    │   │   ├── 29107295-*.js        ← shared UI
    │   │   └── + 6 more shared chunks
    │   ├── build/
    │   │   ├── _buildManifest.js    ← Next.js build manifest
    │   │   ├── _ssgManifest.js
    │   │   └── _middlewareManifest.js
    │   ├── media/                   ← 18 instrument branding PNGs (desktop + mobile)
    │   └── chunks/src/assets/
    │       ├── images/              ← 150+ SVG files (knobs, labels, logos, backgrounds)
    │       ├── fonts/               ← 5 woff2 custom fonts
    │       └── sounds/              ← 76 MP3 files (drum samples, SFX)
    └── ...

src/app/
├── route.ts                ← serves index-roland50.html at /
├── about/route.ts          ← serves index-roland50-about.html at /about
├── masterclass/route.ts    ← serves index-roland50-masterclass.html at /masterclass
├── privacy/route.ts        ← serves index-roland50-privacy.html at /privacy
└── trademark/route.ts      ← serves index-roland50-trademark.html at /trademark
```

---

## How it works

The original site is a **static Next.js export** hosted on Netlify. Each route has its own pre-rendered HTML file that references the same shared JS chunks. We:

1. Downloaded all 5 HTML pages from `roland50.studio`
2. Downloaded all 17 JS chunks (~2.4MB total) from `/_next/static/chunks/`
3. Downloaded the CSS, 18 PNG branding images, 150+ SVG instrument graphics, 5 custom woff2 fonts, and 76 MP3 sample files
4. Stripped Cloudflare Insights from all HTML files
5. Created Next.js route handlers that serve each HTML file at its corresponding path

The browser loads the HTML → loads the JS chunks → React hydrates → the app runs exactly like the original.

---

## Run locally

```bash
bun install
bun run dev
```

Open `http://localhost:3000`. Click **Enter** to dismiss the intro and start making music.

---

## Notes

- **COEP/COOP**: The original site uses `Cross-Origin-Embedder-Policy: require-corp` for SharedArrayBuffer support (needed for some Web Audio worklets). This clone disables COEP because it breaks the Vimeo iframe in Master Class. The audio engine still works — only SharedArrayBuffer-dependent features fall back to a slower path.
- **Vimeo region locks**: Some Master Class videos may be region-locked by Vimeo. That's a Vimeo-side restriction, not a clone issue.
- **Two IR WAV files** (`impulse_guitar.wav`, `ir_rev_short.wav`) from the Tuna.js effects library are referenced but not bundled — they're fallback defaults that the app doesn't actually use (it provides its own IRs).

---

## Reverse engineering process

1. Downloaded the original HTML, identified Next.js Pages Router structure from `_buildManifest.js`
2. Mapped all 5 routes + 4 dynamic routes (`/card/[id]`, `/countdown`, `/shared/[id]`)
3. Extracted all asset paths from JS chunks (170 SVG/font/sound files + 76 MP3 samples)
4. Downloaded everything in parallel (8 concurrent connections)
5. Created Next.js route handlers that serve each route's specific HTML
6. Stripped Cloudflare Insights beacon from all HTML files
7. Tested all 5 routes with Agent Browser + VLM validation

The reverse-engineered bundles are in `/re-roland50/` (gitignored — too large, not needed in the repo).

---

## License

MIT for the wrapper code. All Roland instrument names, designs, code, samples, and trademarks belong to Roland Corporation and Yuri Suzuki.

---

## Deploy on Vercel

The repo is configured for one-click Vercel deployment:

1. Push to GitHub (already done)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import `jazzautomations/roland50-studio-clone`
4. Vercel auto-detects Next.js — just click **Deploy**

The `vercel.json` configures:
- `framework: nextjs` (auto-detected anyway)
- `installCommand: bun install` (faster than npm)
- COOP/CORP headers (same as local)
- 1-year immutable cache for `/_roland50_next/static/*`

### Why `public/_roland50_next/` instead of `public/_next/`?

Next.js **reserves** `/_next/*` for its own runtime (chunks, images, etc). Putting files in `public/_next/` causes a build error:

```
Error: You can not have a '_next' folder inside of your public folder.
This conflicts with the internal '/_next' route.
```

The original roland50.studio HTML references `/_next/static/chunks/...` everywhere (5 HTML files + 17 JS chunks). We can't rewrite those references. Instead, we store the original bundle in `public/_roland50_next/` and add a `rewrites()` rule in `next.config.ts`:

```ts
async rewrites() {
  return [
    { source: "/_next/static/:path*", destination: "/_roland50_next/static/:path*" },
  ];
}
```

So when the original HTML requests `/_next/static/chunks/main-*.js`, Next.js internally rewrites it to `/_roland50_next/static/chunks/main-*.js` and serves the file from `public/`. The HTML doesn't need to be modified.
