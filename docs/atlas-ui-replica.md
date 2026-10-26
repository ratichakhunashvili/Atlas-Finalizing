# How this interface is built

A faithful web recreation of the Atlas Figma file
(`figma.com/design/3N0YrlADgeuFyp8I8oh5of`, page "Page 1"), built screen by screen so the
interface is ready to be given behaviour later.

The design follows [atlas-brand-book.md](atlas-brand-book.md): the palette and the two type
families below are the brand ones, not new choices.

## What is in the file

68 top-level frames, around 3,600 nodes, all mobile at 390 × 844. Sixty-two are screens; six
are component sources (bottom bar, map layer, list results, auth form, next-stop choices, map
sheet, confetti). Three are reference frames: the "Start here" index, the shared states, and
the bottom-bar motion study.

The app has three tabs: **Missions** (map, list and plan), **Scan**, **Profile**.

## Design tokens

Defined once in `src/app/globals.css` and used as Tailwind utilities (`bg-atlas-teal`,
`text-atlas-slate`, `border-atlas-beige`, and so on). No component carries a raw hex value.

| Token | Value | Role |
| --- | --- | --- |
| `atlas-teal` | `#0a4a4f` | Deep Teal — primary surfaces, headings, active states |
| `atlas-teal-soft` | `#3b6b6f` | Primary button while working |
| `atlas-paper` | `#f6f3ed` | Warm White — page and card background |
| `atlas-beige` | `#d7c4b1` | Warm Beige — borders, idle tab labels |
| `atlas-sand` | `#ece4da` | Segmented-control track, banners, skeletons |
| `atlas-sand-deep` | `#e2d7ca` | Skeleton title line |
| `atlas-dune` | `#e6dccd` | Map base tone |
| `atlas-bronze` | `#a58d66` | Muted Bronze — selected marker ring |
| `atlas-ink` | `#1d2929` | Body text, dark banners and toasts |
| `atlas-slate` | `#4a5757` | Secondary text |
| `atlas-danger` | `#8a3b2e` | Field error, delete account |
| `atlas-linen` | `#e9e3d9` | Text on teal cards |
| `atlas-umber` | `#8f7f6b` | Locked achievement outline |
| `atlas-mist` | `#b9c2c2` | Disabled button, switch off, camera labels |
| `atlas-water` | `#c3d6d2` | Map water |
| `atlas-night` | `#2b3838` | Camera surface |
| `atlas-fog` | `#d8dede` | Map detail |
| `atlas-lagoon` | `#2a6266` | Photo placeholder on teal |

Type: **Space Grotesk** for headings, navigation and labels (`font-grotesk`); **Manrope** for
body and interface copy (`font-manrope`). Both are SIL Open Font License families, loaded and
self-hosted with `next/font/google`.

Line heights are taken from the Figma text node heights rather than left to the browser.
Browser defaults drift a pixel or two per block, which compounds into a visible offset down a
long screen.

## Artwork

Icons, the nav bar shapes and the logo are exported from Figma into `public/atlas-ui/` and
used as exported — never redrawn, recoloured or inlined, and always rendered at their
intrinsic size. `src/components/atlas-ui/asset.tsx` is the single place that renders them.

## The screen registry

`src/components/atlas-ui/screens.ts` lists every frame in the file with its Figma node id, its
route, its phase and whether it has been built. The index page reads it, so an unbuilt screen
is shown dimmed instead of as a dead link, and a reviewer can always find the frame a route
came from.

## Status

Every UI frame in the file is built: 62 entries in the registry, none left unbuilt. Routes
are listed in `screens.ts`; `/` is the map home and `/guide` is the "Start here" index.

| Area | Screens |
| --- | --- |
| Entry and auth | welcome, sign in, reset password and sent, QR invalid, no stay, location and camera permission |
| Map home | Mapbox map with exact markers, filters, place sheet, location and hotel toasts, next stop on the map |
| Places | list, partner details (2, 1, 4), spa, pool, attraction, no partner fits |
| Plan | preferences, building, ready, my plan and its six variants, empty, repair and confirm, four routes |
| Scan | scan, six check-in problems, checked in, AR unlock, three unlocked screens, choose next stop |
| Profile | profile, achievements, two achievement details, permissions, help and privacy, terms (signed out), delete account |
| Kit | shared states, bottom bar, bottom-bar motion reference |

## Known limitations

- **Width.** The design frame is 390 wide and the replica caps at 390, so it is exact on
  desktop and on phones at that width or wider. Below 390 the layout compresses fluidly and is
  no longer pixel-exact.
- **The map.** The Figma map is hand-drawn artwork. Mapbox renders real streets, so that layer
  cannot match the design pixel for pixel; the palette is tuned to match and everything drawn
  on top of it is exact.
- **Motion.** Screens are static. The bottom-bar motion reference (`/kit/bottom-bar-motion`)
  switches tabs instantly; its "liquid" transition and the confetti are deferred. The one
  exceptions are the busy button's spinner and the plan-building spinner, which would read as broken if they were still; they
  respects reduced-motion settings. Plan building advances to "ready" on a timer.
- **Prototype behaviour.** Buttons navigate between screens as the Figma prototype does.
  Nothing is saved, booked, sent or requested: switches, the data request row, "Delete
  account" and next-stop choices only change what is on screen.
- **Camera.** Scan and AR use the design's own placeholder surfaces; no camera is opened.
- **Routes.** The four walking routes are fixtures fetched once from Mapbox Directions and
  stored in `routes.json`, not live routing.
- **The logo.** Figma renders the logo slots empty, so the replica keeps those spaces empty
  (`SHOW_LOGO = false` in `asset.tsx`). Flip it to show the mark when it is wanted.

## Verifying a screen

```bash
npm run dev
npm run shots -- /:index /states:states
```

Screenshots land in `screenshots/` at 390 CSS pixels, captured at 2× for detail, with console
errors, page errors and failed requests reported per route. Compare each against the render of
the same Figma frame.

Every screen was compared side by side with its Figma render this way. `scripts/shots.mjs`
also fails loudly on console and page errors, which is how a broken scan-problem import was
caught.
