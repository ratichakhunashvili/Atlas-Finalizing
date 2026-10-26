# Atlas Finalizing — working agreement

This project recreates the Atlas guest interface from the Atlas Figma file
(`figma.com/design/3N0YrlADgeuFyp8I8oh5of`) as a real web interface, screen by screen, so it is
ready to be given behaviour later.

## Scope

**Interface only.** No database, no authentication, no server actions, no business logic. Screens
use the design's own demo copy and typed local fixtures. Mapbox replaces the design's hand-drawn
map artwork; everything drawn on top of the map is recreated exactly.

## Working style

Every UI frame is now built (see [docs/atlas-ui-replica.md](docs/atlas-ui-replica.md)). Further
work — behaviour, animations, data — goes one approved step at a time: inspect before changing,
state the plan, implement only the approved scope, verify, then stop for review.

Never claim a screen matches the design, or that a check passed, unless it actually ran. Screens
are verified by screenshotting the route at 390 CSS pixels and comparing it against the render of
the same Figma frame.

Before finishing a step, these must pass:

```bash
npm run typecheck
npm run lint
npm run build
```

## Fidelity rules

- The Figma file is the source of truth for layout, spacing, colour, type and copy. The design
  follows [docs/atlas-brand-book.md](docs/atlas-brand-book.md); do not introduce colours, fonts
  or logo placements that are not in the design.
- Use the design tokens in `src/app/globals.css` (`bg-atlas-teal`, `font-grotesk`, and so on).
  No raw hex values in components.
- Artwork exported from Figma lives in `public/atlas-ui` and is used as exported — never
  redrawn, recoloured, inlined, or stretched away from its intrinsic proportions.
- Take line heights from the Figma text node heights. Browser defaults drift by a pixel or two
  per block, which compounds down a long screen.
- Build every state the design draws, and add the accessible states it omits: visible focus,
  real labels, and controls that work from the keyboard.

## Product rules that shape the interface

Atlas is a hotel-anchored experience platform for guests already staying at a hotel. The guest's
hotel supplies the context.

**Only hotel-owned facilities and external places that the guest's own hotel has explicitly
partnered with may ever be shown as a recommendation.** Nearby, popular or present in Mapbox does
not make a place eligible. This interface does not enforce that rule — it has no server — but it
must not be built in a way that assumes otherwise, and when behaviour is added, eligibility has
to be decided on the server, never in the browser.

Keep hotel-owned facilities and external partners visually and structurally distinct, as the
design does. Achievements are unlocks, not points or an XP economy. There is no booking or
payment anywhere in this design; do not add one.

## Fixtures

Demo content comes from the Figma file: Hotel A, Partner Place 1/2/4, Pool, Spa, Attraction 1.
Keep fixture ids stable so screens can be compared across changes. Fixtures are obviously
fictional and must never be presented as real hotels, partners or bookings.
