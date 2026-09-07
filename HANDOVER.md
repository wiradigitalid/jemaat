# Handover — Jemaat, before G1

Written 2026-09-07 at the end of the design phase, for whoever runs the gates next. Read this
before touching `.what/`, `.how/` or `.control/`.

**State: design only. No implementation exists.** `gates_passed` in
`.control/registry/index.yaml` is empty, `.control/decisions/` is empty, and there is no `apps/`
directory yet.

---

## 1. Where things are

| What | Where |
|---|---|
| Design canvas, 94 artboards, 47 iterations | <https://claude.ai/code/artifact/689187a4-319b-4df5-a81c-3588c58859e1> |
| Canvas source (generators, not corpus) | `.work/design/*.mjs` — `node gen.mjs` rebuilds, `node pack.mjs` republishes |
| **UI/UX export for the build** | `.work/design/export/` — start at its `README.md` |
| Design system + tokens | `export/design-system.md`, `export/tokens.css` (generated from `lib.mjs`) |
| Component mapping to shadcn | `export/components.md` |
| Screen inventory | `export/screens.md`, and `export/screens.json` (machine-readable) |
| 23 rendered screens | `export/screens/*.png`, source in `export/html/*.html` |
| Working proof, React + shadcn | `.work/spike-w25/` — W25 built for real; `npm i && npm run dev` |

`.work/` is scratch and MUST NOT be imported by the application. The export's durable home is
`.how/`, and that move belongs to `wdi-ux`, not to a hand copy.

---

## 2. What is decided — do not relitigate without a reason

**Scope.** The first release is the **admin register only** — one role, the church office. No
member, guest or leader surface of any kind. The mobile app is a separate later build that brings
the other three roles. Why: every other flow in the product is two-sided; pendataan is the only
one-sided flow, so it is the only slice that works with an audience of one. See sheet **S12**.

**Stack.** Go for the API, React for the web. **shadcn/ui as the primitive layer** — it copies
source into the repo, so it is not a theming constraint — with `export/tokens.css` appended after
the shadcn defaults in the same CSS file. Proven in `.work/spike-w25/`: class overrides only, no
component source rewritten.

**Three visual rules that stock shadcn breaks.** No shadows anywhere (depth is a 1px border plus a
cream-to-white step). No red (errors use amber `--warning`; destructive is the accent darkened).
Light only — the `.dark` block in `tokens.css` is an undesigned mechanical inversion.

**Copy rule.** Screens carry product copy only. No screen codes, no rationale, no
"not in this release" panels. Reasoning lives in the canvas notes and the S-sheets.

**Person: eleven fields.** Full name, date of birth, phone, second phone (optional), address with a
map point, membership type, current membership church, with-us-since, serving-role interests,
care-group wish. Phone width keeps a four-field fast path with the rest behind *More details*.

**Membership tiers: Guest | Member | Registered Member.** "Community Member" is retired.

**Household is not family.** A household is an address with people in it and changes when somebody
moves; a family is who those people are to each other and survives a move. What ships is the
household plus a relation per occupant, covering kin *and* non-kin (household helper, boards here,
friend, other) — whether someone counts as family is derived from the relation, never asked twice.
Two households may share one address; that is the escape hatch. Kinship *between* households is
deliberately not a table. Sheet **S14**.

**Serving is two-level master data.** `department` → `serving_role`; a person expresses interest in
a *role*. The department is a non-selectable heading in the picker. **The catalogue starts empty and
is never seeded.** Interest is a wish, never a roster — `serving_assignment` stays unbuilt. Sheet
**S15**.

**Map: OpenStreetMap.** Free tiles, no key, self-hostable. The stored coordinate comes from a
draggable pin, because Indonesian addresses defeat geocoders.

**Three schema decisions that show on no screen and cost a migration later:** two stores with one
writer each (church archive vs. person statement, from canvas iteration 42); one global `person`
table with everything else scoped per church; a service is an entity, not a date.

---

## 3. What is open

- **No `DEC-` exists for anything.** The scope decision, the household/family split, the serving
  catalogue and the stack are all unrecorded. Highest-value first act after G1.
- `product.client` in `.control/registry/index.yaml` is still the placeholder `"Church Name"`. G1
  confirms product identity.
- `mode: catalog` globally → **G4 is skipped** unless a component sets its own mode.
- **W6 and W2 drift**: both predate the eleven-field person and the household split. Build W22/W26
  first, then re-derive them. See the drift note in `export/screens.md`.
- Dark mode is undesigned. Leaflet with real OSM tiles is unproven. The two hardest components (the
  grouped role picker, the household matcher) exist as designs but not as code.
- The pilot church has seen none of this.

---

## 4. The screens the release needs

Nineteen product screens. `export/screens.json` is the machine-readable list; codes continue the
canvas `W` series and a width is never a new series.

**Current, drawn in the admin pass:** W18 sign in (desktop) · W19 sign in (phone) · W20 the link
inside messages · W21 the register on a phone · W22 add a person (desktop) · W23 add a person
(phone) · W24 care groups · W25 the church record · W26 a household · W27 departments and roles ·
W28 the role picker open (a state of W22) · W29 no departments yet (the state it ships in).

**Older, in the release unchanged:** W11 the empty People table · W2 People table · W6 one person
and lifecycle · W5 import from Excel · W12 merge two records · W10 export and leaving · W13
administrators.

**Build order** (from sheet S13, and the order matters more than the total): church record and
tenancy → admin auth with two administrators → households then people → the map → care groups then
the serving catalogue → import then merge → export.

**Not in this release**, named so nobody builds them by reflex: offline queue, push, app shell,
RSVP, attendance, meetings, warta, applications, serving rosters, and the statement store's second
writer.

---

## 5. Running the gates

The repo installs **WDI Method** over BMad. Read `AGENTS.md` first — it is loaded every session and
it owns the routing table. Two rules that bite:

- **A skill is never invoked automatically.** Name the one that fits and wait for the owner's
  go-ahead, even when the skill's own description says it must be used.
- A method file is never invented or patched in this repo. If a rule is wrong, it is fixed in the
  `wdi-method` package and pulled with `npx wdi-method update`.

| Gate | Decides | Skill | What it should consume from the canvas |
|---|---|---|---|
| **G1 Problem** | What the problem is, whose it is, why it earns work | `wdi-problem` | S12 (why the register ships alone), and the client identity still missing from the registry |
| **G2 Product** | What is built and how it feels to use | `wdi-product`, then optional `wdi-ux` | The 19 screens, S13's build order, S14 and S15 for the two models. `wdi-ux` is what lands `export/` into `.how/` as the design system and screen registry |
| **G3 Blueprint** | The whole portrait, once | `wdi-blueprint` | The three schema decisions in §2, S14 and S15's tables, the eleven-field person |
| **G4 Component** | Depth of one component | `wdi-component` | **Skipped at `mode: catalog`.** Only if a component raises its own mode |
| **G5 Release** | Whether it is done and proven | `wdi-build` | The build order, and `.work/spike-w25/` as the styling reference |

Any time: `wdi-decision` (record a `DEC-`) · `wdi-question` · `wdi-log` · `wdi-reconcile` (drift
between layers) · `wdi-review` · `wdi-help` (which gate now) · `wdi-systematic-debugging`.

### Where the general-purpose skills fit

Available this session as `tdd`, `domain-modeling`, `codebase-design`, `prototype`, `research`,
`grilling`, `code-review`, `diagnosing-bugs`, `writing-for-agents`, `resolving-merge-conflicts`,
`setup-pre-commit`, `git-guardrails-claude-code` (they may appear prefixed `mattpocock-skills:`).

| Skill | Use it | Caution |
|---|---|---|
| `grilling` | Before G1 and G2, to stress-test the brief and the scope cut | — |
| `research` | The two external dependencies: WhatsApp Business templates and approval lead time, and the Nominatim usage policy. Do this before G5, not during | — |
| `domain-modeling` | The glossary and terminology work — `.control/product-glossary.md` already exists | **Do not let it write ADRs.** This repo's decision record is `DEC-` via `wdi-decision`; an `adr/` folder would be a second source of truth |
| `codebase-design` | Go module seams at G3, and again when the API surface is designed | — |
| `prototype` | State-model questions before committing a schema | `.work/spike-w25/` is the precedent: scratch, never imported |
| `tdd` | Per story inside G5 | The user's global rule: when a change's core is a guard, its test must be **seen failing** first |
| `diagnosing-bugs` | — | **Prefer `wdi-systematic-debugging`**: `AGENTS.md` requires it before any fix is proposed. Do not run both |
| `code-review` | When a change earns it | Global rule: review is **not** mandatory, and no reviewer panel unprompted |
| `writing-for-agents` | Only when editing `AGENTS.md` or a skill | Project `AGENTS.md` is the source of truth and must be synced to `CLAUDE.md` and `.agents/AGENTS.md` |
| `setup-pre-commit`, `git-guardrails-claude-code` | Optional hygiene, once `apps/` exists | — |

---

## 6. Prompt to open the next session

Paste this:

> Baca `HANDOVER.md` di root dulu, lalu `AGENTS.md`. Kita lanjut dari akhir fase desain: canvas dan
> ekspor UI sudah selesai, belum ada kode.
>
> Rencananya jalan G1 sampai G5 dengan WDI Method. Mulai dari **G1** dengan skill `wdi-problem` —
> tapi jangan langsung dipanggil: sebutkan dulu apa yang akan kamu lakukan, apa yang masih kurang
> (identitas klien di `.control/registry/index.yaml` masih placeholder), dan tunggu saya bilang
> mulai.
>
> Sebelum itu, konfirmasi ke saya bahwa kamu sudah membaca dan setuju dengan tiga hal ini, karena
> semuanya sudah diputuskan dan tidak untuk dibahas ulang: (1) rilis pertama **hanya admin
> register**, satu role; (2) stack **Go + React + shadcn**, dengan `export/tokens.css` menang di
> atas default shadcn; (3) pemisahan **household vs family** dan **department → serving role** persis
> seperti di sheet S14 dan S15.
>
> Catatan: 19 layar yang perlu dibangun ada di `.work/design/export/screens.json`, urutan build-nya
> di sheet S13, dan belum ada satu pun `DEC-` yang tercatat — itu kandidat tindakan pertama setelah
> G1.

---

## 7. This file

Its durable home is `.control/`, which is the layer for what currently holds. It sits at the root so
a fresh session finds it without being told twice. Once the gates start, `wdi-log` and
`wdi-decision` own that state and this file should shrink to a pointer rather than grow.
