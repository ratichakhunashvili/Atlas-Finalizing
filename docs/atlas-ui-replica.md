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

Every UI frame in the file is built: 62 frames, plus three achievement-detail screens built from
frame 1:989 so every achievement a screen mentions has somewhere to go. Routes
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

## Layouts

At 390 × 844 every screen renders its Figma frame. Other sizes adapt the composition instead of
scaling it. One breakpoint, `wide` (768 px and wider, or any landscape screen 500 px tall or
less), changes the app's shape; `short` (500 px tall or less) tightens sheets and footers. Both
are defined once in `src/app/globals.css`.

| Size | Navigation | Map screens | Detail screens | Forms and messages |
| --- | --- | --- | --- | --- |
| Under 390 | Flexible bar: same colours, icons and raised active tab; the exported bar artwork can't shrink without distorting | Overlays stack from the top; sheet collapses from its handle | Photo above, details below | Full width |
| 390–767 | The exported Figma bar, exactly (centred on wider phones) | As designed | As designed | As designed |
| Wide | Left navigation rail | Header, chips and places (or directions, or next-stop choices) in a side panel beside the map; controls and toasts on the map | Photo fills the left half, details scroll on the right | Centred card on Warm Sand, 560 px max |

Safe-area insets keep controls clear of notches and home indicators, and `100dvh` follows
mobile browser bars. Screens 500 px tall or less start the map sheet collapsed, and camera
screens scroll rather than letting the sheet cover the viewfinder.

## Demo state

So a walkthrough never contradicts itself, the guest's choices, plan, check-ins and achievements
live in one typed store (`src/components/atlas-ui/demo/`), kept in this browser's localStorage
under `atlas-prototype-demo-v1`. Every time, count, label and suggestion comes from one
deterministic model, `demo/plan-model.ts`, covered by `npm test`:

- A frozen demo clock (16:35) and a 16:00 start; walk minutes between places reproduce the
  design's own numbers where they are consistent (arrive 16:06, "11 min walk", back at 18:10).
- A plan may end up to 15 minutes after the chosen free time before it "runs over".
- Plans are built only from the fixture places that match the chosen interests and price, never
  from the unavailable Partner Place 3, and keep completed stops as they are.
- An achievement is unlocked when its place is checked in (the spa's was unlocked yesterday).

The design's My plan states (`/plan/replaced`, `/plan/added-pool`, …) seed the store with that
state, so `/guide` can open each one and the plan then behaves normally. `/guide` also has
**Reset the demo**. Nothing leaves the browser; there is no account, and screens that simulate
an action (scans, check-ins, data requests, deleting the account) say so.

## Deliberate differences from the frames at 390

- **Times and counts follow the model.** The frames contradict each other: the pool frame says
  "back by 19:10" over a footer of "around 18:10"; replacing stop 3 says 18:15; removing it
  says 17:40. Now:
  - the header and footer always agree;
  - replacing stop 3 with Partner Place 4 honestly runs over, back around 19:25;
  - removing stop 3 leaves 18:10.
- **Plan ready.** It no longer offers Partner Place 3, which My plan marks unavailable, so the
  default proposal is one stop.
- **Repair.** The suggestion's return time is computed, and it drops a "Budget" chip the
  partner doesn't have.
- **Honest prototype copy.** The following replace claims the prototype can't back up:
  - "Saved in this browser (prototype)" instead of "Saved to your achievements";
  - "Location not checked" instead of "You're at …" and "location accurate to 12 m";
  - "Prototype · nothing was requested" for the data request;
  - the "Delete account" result, which is honest that no account exists;
  - the note on Permissions;
  - the notes on sign-in and reset password;
  - the language row, which says Georgian isn't available instead of relabelling an English
    interface.
- **Context fixes.**
  - "See achievement" on the already-checked-in case opens Achievement 3, for Partner Place 2.
  - The place-unavailable case is about Partner Place 3, which is the stop "Fix" repairs.
  - The not-in-plan case points to Partner Place 4.
  - Every "Call the front desk" says calling isn't connected instead of opening Profile.
- **Additions.**
  - A **Map** button on the list.
  - A clear button and an empty state for search.
  - A handle on the map sheet that collapses it.
  - One-line "kept in this browser only" notes on My plan and the check-in screens.
  - Photos for the pool, spa, Partner Place 4 and Attraction 1 cards, using the design's own
    exported photos of those places.
- **Accessibility.**
  - Visible focus rings.
  - Native radios for the time, price and next-stop pickers.
  - Real dialogs for remove-stop and delete-account. Focus starts on the sheet, not on the
    destructive button.
  - 6 px larger hit areas on small text links (no visual change).
- **Bar shadow.** The bar artwork's shadow is clipped 2 px at the frame edge, so tabbed screens
  measure the design's 844, not 846.

## Production integrations still to build

Outside this repository's interface-only scope. The prototype shows where each plugs in:

- **Accounts.** Real authentication, sessions, password reset email and sign-out.
- **Stays.** Hotel-stay data: linking a guest to their stay from the hotel QR, the no-stay
  case, check-in and check-out dates.
- **Eligibility.** Decided on the server: only Hotel A's own facilities and explicitly approved,
  active partners, never Mapbox POIs or nearby businesses, with partnership status and expiry.
- **Planning.** On the server: real opening hours, walking times, availability and the guest's
  clock, replacing `demo/plan-model.ts`.
- **Check-in.**
  - QR codes as opaque, hashed, purpose-specific tokens, with expiry and revocation.
  - Location check-in verified on the server: accuracy, freshness and distance.
  - Camera permission and code reading.
  - The camera-view (AR) unlock.
  - Protection against duplicate check-ins.
- **Directions.** Live Mapbox walking routes instead of the stored fixtures.
- **Achievements.** Stored server-side per stay, with ownership checks.
- **Data rights.** Data export and account deletion, with retention rules.
- **Approved content.** Approved terms of use and privacy notice; verified partner descriptions,
  hours, addresses and photos; hotel phone number and support email.
- **Localization.** Georgian, with Noto Sans and Serif Georgian as the brand book specifies.
- **Permissions.** Reading and requesting real browser permissions behind the Permissions
  screen.

## Known limitations

- **The map.** The Figma map is hand-drawn artwork. Mapbox renders real streets, so that layer
  cannot match the design pixel for pixel; the palette is tuned to match and everything drawn
  on top of it is exact.
- **Motion.** Screens are static. The bottom-bar motion reference (`/kit/bottom-bar-motion`)
  switches tabs instantly; its "liquid" transition and the confetti are deferred. The one
  exceptions are the busy button's spinner and the plan-building spinner, which would read as broken if they were still; they
  respects reduced-motion settings. Plan building advances to "ready" on a timer.
- **Prototype behaviour.** Buttons navigate as the Figma prototype does. Plan changes,
  check-ins and achievements persist in this browser only (see Demo state); nothing is booked,
  sent or requested, and the Permissions switches don't touch browser permissions.
- **Camera.** Scan and AR use the design's own placeholder surfaces; no camera is opened, and
  tapping the viewfinder or marker simulates the check-in.
- **Device testing.** Phone sizes were checked with Chromium's mobile emulation, not on real
  iOS Safari or Android Chrome devices. Type is set in px, as the design specifies, so it
  follows browser zoom (checked at 200%) but not the OS text-size setting.
- **Favicon.** None: the design's logo placements are pending, and a favicon would be one.
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

`npm run test:ui` checks ten viewports (320 × 568 to 1440 × 900, landscape, and 200% zoom) for
sideways scrolling, controls off screen or covered, and targets under 24 px, then walks the
main journeys. `npm test` covers the planning model.

Every screen was compared side by side with its Figma render this way. `scripts/shots.mjs`
also fails loudly on console and page errors, which is how a broken scan-problem import was
caught.
