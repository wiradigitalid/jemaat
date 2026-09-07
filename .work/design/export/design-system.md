# Jemaat design system

Extracted from the design canvas (94 artboards, 47 iterations). `tokens.css` is generated from
`lib.mjs`; this file explains the parts a token file cannot carry.

Target stack: **shadcn/ui + Tailwind**. Stock shadcn breaks three rules of this system by default,
so read *The three rules* before installing components.

---

## The three rules

### 1. No shadows, anywhere

Depth is **a 1px border plus a surface step** — the page is cream (`#FAF7F2`), a raised surface is
white (`#FFFFFF`). Nothing floats.

Chosen because a shadow disappears on a cheap Android screen in daylight, and because a 1px line
needs no per-platform tuning. 94 artboards contain zero shadows. `tokens.css` neutralises the
`shadow-*` utilities as a guard, but prefer deleting them from the markup: a stray `shadow-sm` is
the single fastest way to make this look like every other admin panel.

Applies to dropdowns and popovers too. The role picker on W28 is a bordered white panel, not a
floating card.

### 2. No red

There is no red in this product. A church register carries bad news — a death, a declined
applicant, a member who stopped coming — and none of that should look like a system failure.

| Need | Token | Value |
|---|---|---|
| Error, warning, "needs attention" | `--warning` on `--warning-muted` | `#9A7223` on `#F7EEDD` |
| Success, confirmed, present | `--success` on `--success-muted` | `#4C6B52` on `#EAF0EA` |
| Destructive action (delete, revoke) | `--destructive` | `#8E4224` — the accent darkened, not a new hue |

shadcn ships `destructive` as red. It is overridden in `tokens.css`; do not reintroduce red for
form validation, toasts, or a `<Badge variant="destructive">`.

### 3. Light only, on purpose

One palette, no dark counterpart in any artboard. `tokens.css` ships a `.dark` block that is a
mechanical inversion with **no design pass** — it exists so a stock dark toggle does not render
unreadable text. Either drop the toggle for the first release or budget a pass.

---

## Colour

Nine roles, and the discipline is that the accent is the only saturated colour on a screen.

| Role | Hex | Where |
|---|---|---|
| `bg` page ground | `#FAF7F2` | every screen background |
| `surface` | `#FFFFFF` | cards, inputs, dropdown panels |
| `surfaceAlt` | `#FFFDFB` | page headers, toolbars, sidebar |
| `ink` | `#241E1A` | body and headings |
| `ink2` | `#6B6058` | secondary prose, field labels |
| `ink3` | `#9A8F85` | meta, placeholders, disabled-ish text |
| `line` | `#E9E1D7` | all borders — the depth cue |
| `lineSoft` | `#F1EAE1` | dividers inside a card |
| `accent` | `#B4562F` | primary action, active nav, links |
| `accentDark` | `#8E4224` | hover on accent, destructive |
| `accentTint` | `#F6EAE3` | selected rows, chips, avatars, hover |
| `sage` / `sageTint` | `#4C6B52` / `#EAF0EA` | success, "answered", "present" |
| `amber` / `amberTint` | `#9A7223` / `#F7EEDD` | warning, "needs attention" |
| `disabled` / `disabledInk` | `#EFE8DF` / `#B5AAA0` | deactivated rows (e.g. a retired serving role) |

**Neutrals are warm on purpose.** They carry a slight hue bias toward the accent; a pure grey next
to `#B4562F` reads as unconsidered.

---

## Type

Two faces, both from Google Fonts.

- **Display — Newsreader** (serif). Weights 400/500/600. Page titles, sheet titles, big numbers.
  Always `font-weight: 500`, `letter-spacing: -0.01em`, `text-wrap: balance`.
- **Body — Plus Jakarta Sans**. Weights 400/500/600/700. Everything else.

Fallbacks matter more than the webfonts: on a weak connection the fallback is what most of the
congregation reads, so `Georgia` and `system-ui` were chosen for metrics close enough that the
layout does not shift when the real faces land.

**Scale** (px) — every size on the canvas is one of these, and the count was cut from 32 to 15
twice, because an unenforced scale drifts back:

```
9  10  11  12  13  14  15  17      body ramp   (13 is the real default)
20  24  27  34                     display ramp
```

Conventions:
- Body text `13px`. Meta `11px`. Micro-labels `10px`.
- **On a phone, body is `17px`** minimum for readable type — half a congregation is over fifty.
- Uppercase eyebrow labels: `10px / 700 / 0.09em`, colour `ink3`. Use `.label-eyebrow`.
- Field labels: `12px / 700`, colour `ink2`.
- Numbers in columns: `font-variant-numeric: tabular-nums` (`.tabular`).
- Running text stays near 65 characters.

---

## Radii, heights, spacing

| Token | Value | Use |
|---|---|---|
| `--radius-mark` | 6px | checkbox, tiny status marks |
| `--radius` | 12px | inputs, buttons, chips, list rows |
| `--radius-card` | 14px | Card only |
| pill | 999px | badges, avatars, segmented items |

**Control heights** — anything else snaps *down* to the nearest: `34 · 40 · 44 · 48 · 52 · 56`.
Desktop input and button default `44`; primary action `48`; phone input `52`; small inline
action `34`.

**Spacing**: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40`. This is the one axis the canvas never
systematised up front (S6 says so) — it is derived from usage, so enforce it in code.

Page padding: desktop `26–32px`, phone `16px`. Card inner padding `13–22px` depending on density.
Gap between stacked cards `16–20px`.

---

## Iconography

Custom 24×24 paths, `stroke-width: 1.7`, round caps and joins, `fill: none`. **Use
[Lucide](https://lucide.dev)** — same grid and language, and it is shadcn's default. Set
`strokeWidth={1.7}` (not the default 2) and render at 16–19px inside controls.

Mapping for the icons the canvas uses:

| Canvas | Lucide |
|---|---|
| home, users, user, group | `Home`, `Users`, `UserRound`, `Network` |
| userPlus, search, plus, check, x | `UserPlus`, `Search`, `Plus`, `Check`, `X` |
| chevR / chevL / chevD | `ChevronRight` / `ChevronLeft` / `ChevronDown` |
| chat, bell, mail | `MessageCircle`, `Bell`, `Mail` |
| pin, globe, qr | `MapPin`, `Globe`, `QrCode` |
| cal, clock | `Calendar`, `Clock` |
| upload, share, out | `Upload`, `Share`, `ExternalLink` |
| sliders, filter, grid, more | `SlidersHorizontal`, `Filter`, `LayoutGrid`, `MoreHorizontal` |
| lock, archive, edit, swap | `Lock`, `Archive`, `Pencil`, `ArrowLeftRight` |
| help, offline, checkCircle | `HelpCircle`, `WifiOff`, `CheckCircle2` |
| hand, megaphone, quote | `Hand`, `Megaphone`, `Quote` |
| play, playFill, video, inbox | `Play`, `Play` (filled), `Video`, `Inbox` |

Icons are never decoration and never a section marker. No emoji anywhere.

---

## Copy rules

These are part of the system; a screen that breaks them looks wrong even with correct tokens.

- **No design talk in the UI.** No screen codes, no iteration numbers, no "not in this release"
  panels, no rationale. Every reason lives in the canvas notes and the S-sheets.
- **Institutional vocabulary never appears before someone is inside the institution.** In the admin
  console the precise word is correct — Guest / Member / Registered Member — because precision is
  what an office runs on.
- A control says exactly what happens: `Publish`, then a toast reading `Published`.
- Errors say what went wrong and how to fix it. No apologies.
- Numbers are stated, never scored. There is no attendance rate, engagement score, or percentage
  anywhere in the product, and none in the schema either.
- A missing value is named (`No phone on file`), never blank and never `—`.
- Empty is a correct state. An empty screen gets one sentence and one action, not a filler card.

---

## What is deliberately absent

Know these before adding a component "for completeness":

- No shadows, no red, no dark mode (above).
- **No notes field** on a person. It fills with things a church should not write down, and it
  cannot be undone once a congregation has used it for a year.
- **No counts or scores** about attendance or engagement — not in the UI and not as a column.
- **No toast for routine saves.** The row updating is the confirmation.
- No zebra striping in tables; rows are separated by `lineSoft`.
- No gradient, no glassmorphism, no illustration set. The one drawn graphic is the map, and it is
  a real map (OpenStreetMap tiles), not an illustration.
