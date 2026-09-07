# Jemaat — admin register: UI/UX export

Everything needed to build the first release (the church office alone) on **shadcn/ui + Tailwind**
without the result drifting from the design canvas.

Exported 2026-09-07 from canvas page 8 — 94 artboards, 47 iterations.
Live canvas: <https://claude.ai/code/artifact/689187a4-319b-4df5-a81c-3588c58859e1>

## Contents

| Path | What it is |
|---|---|
| `design-system.md` | Colour, type, spacing, radii, icons, copy rules — and **the three rules stock shadcn breaks**. Read first. |
| `tokens.css` | Drop-in CSS variables for shadcn (Tailwind v4 hex block, v3 HSL block commented below it), plus a base layer. Generated — do not hand-edit. |
| `components.md` | Every canvas component → its shadcn component, with the class overrides that make stock shadcn match. Includes the two hard interactions (grouped role picker, household matcher) and the map. |
| `screens.md` | The twelve product screens and four spec sheets: route shape, size, purpose. Plus the build order. |
| `screens/*.png` | Every screen rendered at its exact artboard size. |
| `html/*.html` | The same screens as self-contained HTML. **Measure against these, not the PNGs** — they are the source the PNGs came from. |
| `_gen-tokens.mjs` | Regenerates `tokens.css` from `../lib.mjs`. |

## Order to read

1. `design-system.md` — the three rules (no shadows, no red, light only) decide more than the tokens do.
2. Install `tokens.css`, then `screens.md` for what exists.
3. `components.md` when wiring a specific screen.

## Regenerating

```bash
cd .work/design
node gen.mjs                 # artboards + canvas.json from the screen modules
node export/_gen-tokens.mjs  # tokens.css from lib.mjs
node pack.mjs                # rebuild the published canvas page
```

`lib.mjs` is the single source of truth for colour, type, radii and control heights. Change it
there and re-export; never edit `tokens.css` by hand, or the canvas and the code will disagree
within a week.

## Two things this export deliberately does not contain

- **A seed list of departments and serving roles.** The catalogue starts empty; W29 is the state it
  ships in. A starter list quietly imposes a structure, and serving is named locally.
- **A dark theme worth shipping.** The `.dark` block in `tokens.css` is a mechanical inversion with
  no design pass, present only so a stock toggle does not render unreadable text.

## Where this belongs later

This folder is a working export under `.work/`. Its durable home in the method is `.how/` — the
design system, the screen registry and the UX documents are slots owned by the `wdi-ux` skill.
Landing it there is a separate, deliberate step; nothing here should be copied into `.what/` or
`.how/` by hand.
