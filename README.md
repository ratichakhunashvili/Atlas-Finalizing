# Atlas Finalizing

A faithful web recreation of the Atlas guest interface from the Atlas Figma file
(`figma.com/design/3N0YrlADgeuFyp8I8oh5of`), built screen by screen so the interface is ready
to be given behaviour later.

> **Tell us when you're free. We'll figure out what you can do.**

This project is **interface only**. Screens use the design's own demo copy and local fixtures.
There is no database, no sign-in and no business logic yet. Mapbox replaces the hand-drawn map
artwork from the design.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Mapbox GL JS.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. That is the prototype index: every screen in the Figma file,
grouped exactly as the design's "Start here" frame. Screens that have not been built yet are
dimmed rather than linked.

The map screens need a public Mapbox token. Copy the example file and fill it in — `.env.local`
is git-ignored:

```bash
cp .env.example .env.local
```

`NEXT_PUBLIC_MAPBOX_TOKEN` is embedded in the browser bundle, so it must be a **public**
Mapbox token (not a secret token). Restrict its allowed URLs in the Mapbox dashboard.

## Deploying to Vercel

1. Import this Git repository in Vercel. Keep the project root as the repository root and the
   Framework Preset as **Next.js**; the existing `npm run build` script is the build command.
   Leave the output directory at its default.
2. In **Project Settings → Environment Variables**, add `NEXT_PUBLIC_MAPBOX_TOKEN` with your
   public Mapbox token. Enable it for every environment you plan to deploy (Production, Preview,
   and Development as needed).
3. In the Mapbox dashboard, allow the deployed Vercel production and preview URLs for that token.
4. Deploy (or redeploy after changing the environment variable). `NEXT_PUBLIC_` values are
   included at build time, so changing the token requires a new deployment.

Next.js 16 requires Node.js 20.9.0 or newer; the project declares this in `package.json`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run the TypeScript compiler without emitting files. |
| `npm run shots -- /:index` | Screenshot routes at 390px for comparison against Figma (`VIEWPORT=320x568` for other sizes). |
| `npm test` | Unit tests for the prototype's planning model. |
| `npm run test:ui` | Browser checks with the dev server running: layout at ten viewports and the main journeys. |

## Layout

```text
src/app                  One route per Figma frame; routes stay thin
src/components/atlas-ui  The reusable kit built from the design
public/atlas-ui          Icons, nav artwork and the logo, exported from Figma
docs                     Brand book and the replica's own notes
scripts                  Screenshot tool used to verify screens against the design
```

`src/components/atlas-ui/screens.ts` is the registry of every frame in the file: its Figma node
id, its route, and whether it exists yet.

## How this is built

See [docs/atlas-ui-replica.md](docs/atlas-ui-replica.md) for the design tokens, what is built
and the known limitations. The design itself follows
[docs/atlas-brand-book.md](docs/atlas-brand-book.md).
