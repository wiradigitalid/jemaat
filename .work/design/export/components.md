# Canvas component → shadcn/ui

Every component on the admin screens, what it maps to, and the class overrides needed to make
stock shadcn match the canvas. Assumes `tokens.css` is installed and the three rules in
`design-system.md` are understood.

Install list:

```
button card input label badge avatar separator table tabs toggle-group
select command popover dialog sheet dropdown-menu checkbox switch sidebar sonner form
```

---

## Shell and navigation

| Canvas | shadcn | Notes |
|---|---|---|
| 246px office sidebar (`sidebar()` in `screens-web.mjs`) | `sidebar` block | `--sidebar-*` tokens are in `tokens.css`. Sections are eyebrow labels (`THE REGISTER`, `THIS CHURCH`); the active item is `bg-accent text-accent-foreground font-bold`, inactive `text-ink-2 font-semibold`, height 40, radius 12. |
| Page top bar (W22, W24, W25, W26, W27) | plain `div`, not a component | `bg-surface-alt border-b h-[78px] px-8`, title `16px/700`, subtitle `12px ink3`, actions right-aligned. Sticky. |
| Nav item badge | `Badge` | Count pill, `bg-primary text-primary-foreground`, min-width 22, radius 999. |
| Phone top nav (W21) | plain `div` | Church avatar + name + search icon, `border-b`. **The four-tab bottom strip from the mobile app does not exist here** — a bottom bar collides with the browser toolbar and loses ~118px of an 844px screen. |

The admin screens fall into three shapes, and this decides the route type:

1. **List / settings routes** — W24 Care groups, W25 Church record, W27 Departments. Live inside the
   sidebar shell with a page top bar.
2. **Detail route** — W26 A household. Top bar leads with a back chevron.
3. **Full-page form over the list** — W22 Add a person, W28 role picker. Top bar leads with `✕`, not
   a chevron: it is a `Sheet` (side="bottom"/full) or a route that returns to where it opened.

---

## Surfaces

| Canvas | shadcn | Override |
|---|---|---|
| `card()` | `Card` | `rounded-[--radius-card] border shadow-none bg-card`. No `CardHeader`/`CardFooter` padding defaults — the canvas uses 13–22px. |
| Accent-bordered card (a card that matters) | `Card` | add `border-[#B4562F55]`. Used sparingly, once per screen at most. |
| Warning card | `Card` | `border-[#9A722344] bg-warning-muted`. |
| `rows()` — divided list inside a card | `div` | `divide-y divide-[--muted]`. Do not use `Separator` per row. |
| Dashed "not yet" box | `div` | `border border-dashed rounded-[--radius] text-ink3`. |

## Controls

| Canvas | shadcn | Override |
|---|---|---|
| `btn()` primary | `Button` | `h-12 rounded-[--radius] bg-primary text-primary-foreground font-bold` (`h-11` on desktop). Icon 18px, gap 8. |
| `btn()` ghost (white + border) | `Button variant="outline"` | `h-11 bg-card border-input font-semibold`. This is the canvas's "ghost", **not** shadcn's. |
| Icon-only action in a top bar | `Button variant="ghost" size="icon"` | `text-ink-2`, no border. |
| `wBtn()` desktop toolbar button | `Button variant="outline" size="default"` | `h-10 rounded-[--radius] gap-2 text-sm font-semibold`; primary variant for the one main action. |
| `miniBtn()` inline row action | `Button variant="outline" size="sm"` | `h-[34px] px-[15px] rounded-[--radius] border-primary text-primary`. |
| `field()` / `deskField()` | `Label` + `Input` | Label `text-sm font-bold text-ink-2` + optional `text-xs text-ink3` tag ("optional", "from the household"). Input `h-11 md:h-11 rounded-[--radius] bg-card px-3.5 text-md`; phone `h-13`. Prefix (`+62`) is a leading span plus a 1px divider inside the field. |
| Field hint | `p` | `text-xs text-ink3 leading-relaxed` under the control. |
| `segmented()` — Guest / Member / Registered | `ToggleGroup type="single"` | Tray `p-1 bg-background border rounded-[--radius]`; item `h-9 flex-1 rounded-[10px] text-base font-semibold`, selected `bg-primary text-primary-foreground font-bold`. Also used for Yes/No. |
| Checkbox row ("This is a shared computer") | `Checkbox` + label block | Box 19px, `rounded-[--radius-mark]`, checked `bg-primary`. Title `13px/600`, hint `11px ink3`. |
| Search input | `Input` | Leading `Search` icon 17px `text-ink3`. |

## Data display

| Canvas | shadcn | Override |
|---|---|---|
| `pill()` / `tierPill()` | `Badge` | Height 20–26, radius 999, `text-xs font-semibold`. Variants: accent (`bg-secondary text-secondary-foreground`), success (`bg-success-muted text-success`), warning (`bg-warning-muted text-warning`), neutral (`bg-background border text-ink3`). Tier labels are exactly `Guest`, `Member`, `Registered Member`. |
| `roleChip()` — `Music / Singer` | `Badge` + `X` button | Department at 72% opacity, `/` at 40%, role bold. Always shows both levels: role names repeat across departments. |
| `addChip()` | `Button variant="outline"` | `border-dashed h-[34px] rounded-full`. |
| `av()` initials avatar | `Avatar` + `AvatarFallback` | `bg-secondary text-secondary-foreground font-bold`, sizes 34/36/38/44. Initials only — there are no photographs in this product. |
| `sq()` church mark | `Avatar` | Same, but `rounded-[12px]` instead of a circle. |
| Person / occupant row | `div` | Avatar + name (`13.5px/600`) + meta (`11.5px ink3`) + optional right slot. One pattern, reused on W24, W26, W27. |
| List row with chevron | `div` | Icon 17px `ink3` + title + meta + `ChevronRight` 18px `ink3`. |
| Stat cell (248 / PEOPLE) | `div` | Serif number `24px/600` + eyebrow label. Three across, separated by 1px `lineSoft`. |
| Table (W2 People, not in this export) | `Table` | `border-b` rows, no zebra, header eyebrow labels, `.tabular` on numeric columns. |
| Deactivated row (a retired serving role) | — | Text `disabledInk`, plus a one-line reason (`Not in use since March`). Never hidden, never deleted. |
| Map | `react-leaflet` + OSM tiles | Not a shadcn component. See below. |

## The two hard interactions

### Grouped role picker (W28)

`Popover` + `Command` (cmdk):

- `CommandInput` — searches **role and department name**, so typing `mus` matches the Music
  department's roles and `Music Slides Operator` in Multimedia.
- `CommandGroup heading={department}` — the heading is a label, **not selectable**. cmdk gives this
  for free; do not turn headings into items.
- `CommandItem` per role. Already-chosen roles stay listed with a `Check` in `success`, dimmed.
- Highlighted item: `bg-accent text-foreground font-bold`.
- Footer line outside the list: `6 of 24 roles match "mus"`.
- Panel: `bg-popover border rounded-[--radius] shadow-none`.
- Multi-select — chosen roles render as `roleChip`s above the input.
- **Empty catalogue is the default state.** A church starts with zero departments, so the field must
  render an empty state pointing at the departments screen. Do not seed anything.

### Household matcher (W22)

`Command` again, with one inverted rule that exists because the canvas manufactured duplicate
households before it was fixed:

- Matching runs **while typing**.
- The existing household sits **above** the create option, never beside it.
- The create item is last and reads `Create a new household · For a different address`.
- Each match shows the occupant count and the address, so the office can tell two Prasetyo
  households apart.

## Map (W22, W25, W26)

- **Tiles and search: OpenStreetMap.** Free, no key for tiles, self-hostable later — the same
  argument the MIT licence already makes. `react-leaflet` + `leaflet`.
- Geocoding: Nominatim (respect the 1 req/s policy — debounce, cache, set a `User-Agent`) or a
  free-tier provider. Self-host if the pilot grows.
- **The pin is the truth, not the text.** Indonesian addresses defeat geocoders — an unnamed gang, a
  repeated blok, an RT only the neighbours know. Search, then let the office drag the marker; store
  `lat`/`lng` from the marker, not from the geocoder.
- Attribution `© OpenStreetMap` is a licence condition, not decoration. Bottom-right, 8px.
- Zoom control is a bordered white stack top-right. No shadow.
- Frame: `rounded-[--radius] border overflow-hidden`, height 190–240.

## Not product — do not build

The phone artboards are drawn inside browser chrome so the constraints are visible. **None of it is
yours to build**: the status bar (time, signal, battery), the address bar, the browser toolbar, and
the in-app-browser header on W20. The only real screen content is below that chrome.

W20 itself *is* product: it is the page an administrator lands on when they open their sign-in link
inside WhatsApp, where there is nothing to add to a home screen. Its three steps are real copy.
