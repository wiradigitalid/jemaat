---
type: structure
scope: document
verified: '2026-09-07'
commit: '32fef1e'
---

# Document Structure

## Verified

2026-09-07 at commit `32fef1e`, derived from the tree on disk, `.gitignore` honoured. Read straight
after `wdi-upgrade` moved this repo from method 0.5.14 to 0.6.15, which is why the two rendered
roots exist and carry only their skeleton pages.

## Top level

```text
.constitution/                # how we work — populated: the method kit plus this product's own room
.control/                     # what currently holds — populated: registries, questions, these two maps
.what/                        # what was promised — EMPTY. Born at G1
.how/                         # how it is built — EMPTY. Born at G3
_bmad-output/                 # work in progress, not curated — EMPTY
```

Two roots the 0.6.15 shape added, both generated and neither hand-written:

```text
.what-rendered/               # reader's pages for .what/ — one file, the brief skeleton
.how-rendered/                # reader's pages for .how/ — one file, the blueprint skeleton
```

## Per layer

### .constitution/

```text
.constitution/
├── method/                   # overwritten in full by `npx wdi-method update` — never edit here
│   ├── constitution.md       # ★ the articles every other rule hangs off
│   ├── repo-guide.md         # ★ whether a file may exist in this repo at all
│   ├── structure-guide.md    # ★ the rules these two maps apply
│   ├── method-glossary.md    # method vocabulary; product terms live in .control/product-glossary.md
│   ├── language-guide.md     # naming: code identifiers, columns, config keys
│   ├── document/             # one guide per artifact, plus templates/
│   ├── why/                  # status: Reference — explains, never binds
│   └── scripts/              # validate.py ★, timeline.py, inventory.py
└── project/                  # ours; update never writes over it, promote never publishes it
    ├── constitution.md       # this product's articles
    ├── codebase-stack-guide.md        # status: Draft
    ├── codebase-conventions-guide.md  # status: Draft
    ├── codebase-brownfield-guide.md   # status: Draft
    ├── inventory-readers.py  # still the shipped skeleton — SKELETON = True, so the engine refuses
    └── README.md
```

All three `codebase-*-guide.md` are `status: Draft`. Per `AGENTS.md` their contents may be read as
guidance but MUST NOT be used to reject a change while that holds.

### .control/

```text
.control/
├── registry/                 # ★ the SSOT rows. Eight files, every one still empty of rows
├── questions/                # four classes by what the reader must do; all four empty
│   ├── blocking.md           #   answer before the gate moves
│   ├── assumptions.md        #   taken and stated — the default class
│   ├── external.md           #   waiting on someone outside
│   └── answered.md           #   closed in place
├── decisions/                # DEC- files — EMPTY. No decision has been recorded yet
├── meetings/                 # minutes — EMPTY
├── memlog/                   # what each skill run did — EMPTY
├── generated/                # machine tables from validate.py --generate; never hand-written
├── product-glossary.md       # domain vocabulary for this product
├── project-non-technical-log.md   # domains, accounts, legal entity, locked dates
├── structure-codebase.md     # derived by wdi-init intent structure
├── structure-document.md     # ★ this file
└── wdi-method.yaml           # the installed version — a trace, not a lockfile
```

### .what/ · .how/ · _bmad-output/

Empty, and correctly so. `.what/` receives `_product-brief/brief.md` at G1 and `_prd/<slug>/prd.md`
at G2; `.how/` receives the spine, C4 and the inventories at G3. No Product Component folder exists
on either side, because components are born at the tail of G2.

The design work that precedes all of this is **not** in these layers. It sits in `.work/design/`
with its UI export, and `.work/` is scratch that MUST NOT be imported by the application. Landing
any of it into `.how/` is `wdi-ux`'s act, not a copy.

## Product Components

None exist. The table stays empty until `wdi-init` intent `component` births the first row at the
tail of G2.

| Product Component | `.what/<pc>/` | `.how/<pc>/` | Slots split out |
| --- | --- | --- | --- |
| — | — | — | — |

## Registries and generated

| File | State |
| --- | --- |
| `registry/index.yaml` | Populated, no list rows. `product.name: Jemaat`; `product.client` is still the placeholder `"Church Name"`; `mode: catalog` confirmed by the owner; `gates_passed: []` |
| `registry/goals.yaml` | Empty skeleton — `BG` rows land at G1 |
| `registry/components.yaml` | Empty skeleton — PCs, containers and LCs, all born after G2 |
| `registry/usecases.yaml` | Empty skeleton — the `UC` catalogue lands at G3 |
| `registry/specs.yaml` | Empty skeleton. Top-level key corrected from `waves:` to `specs:` in the 0.6.15 upgrade |
| `registry/decisions.yaml` | Empty skeleton — no `DEC-` has been written for anything |
| `registry/risks.yaml`, `defects.yaml` | Empty skeletons |
| `registry/requirements.yaml` | **Retired** in the 0.6.15 upgrade. It held five empty lists; `CAP`/`FR`/`NFR`/`UJ` now live in `requirements-<slug>.yaml` per PRD |
| `generated/components·risks·dag·rtm·status·decisions·estimate` | Produced 2026-09-07. All reflect an empty corpus |
| `.what-rendered/_product-brief/brief.md` | Produced — a skeleton page, because no brief exists |
| `.how-rendered/blueprint.md` | Produced — a skeleton page, because no blueprint exists |

## Findings

Reported here, fixed nowhere:

- **`validate.py` walks `.temp/`.** 172 of the 174 remaining `cites-resolve` findings come from a
  third-party checkout inside the git-ignored raw-data folder. `PRUNE_DIRS` in
  `.constitution/method/scripts/validate.py` is a hardcoded frozenset and `.temp` is not in it, so
  this cannot be fixed in this repo — `AGENTS.md` forbids patching a method file here. It belongs in
  the `wdi-method` package, or `.temp/` moves outside the repo, which would also remove the
  confidentiality risk of keeping real personal data inside the tree.
- **`product.client` is a placeholder.** G1 confirms product identity; until then every document
  that quotes the client name would quote `"Church Name"`.
- **No `DEC-` exists.** The scope cut to the admin register, the Go + React + shadcn stack, the
  household/family split and the empty serving catalogue are all decided and none is recorded.
- **`inventory-readers.py` is still the skeleton.** Correct today — there is no code to read — and
  `wdi-init` intent `readers` fills it once a container exists.
- **`.agent/` looks like a stale duplicate** of `.agents/`. Reported in the codebase map.

---

★ = key document: single-copy, referenced from elsewhere, or the first thing a reader must find.
