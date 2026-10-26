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
is git-ignored, so the token never gets committed:

```bash
cp .env.example .env.local
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run the TypeScript compiler without emitting files. |
| `npm run shots -- /:index` | Screenshot routes at 390px for comparison against Figma. |

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
