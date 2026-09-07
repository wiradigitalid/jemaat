# Screens — the admin register

Nineteen product screens and four specification sheets — twelve product screens from canvas page 8
plus the seven older office screens the release also needs.
PNGs in `screens/`, self-contained HTML in `html/` (open in any browser — the HTML is the exact
source the PNGs were rendered from, so measure against it rather than against a screenshot).

Screen codes continue the canvas `W` series. **A width is never a new series**: the phone-sized
office screens are still `W`, because the split is by how big the job is, not by device.

---

## Desktop — 1440 × 900 unless noted

| Code | File | Route shape | What it is |
|---|---|---|---|
| **W18** | `AdminDeskSignIn` | full page, unauthenticated | Sign in. Brand panel left (560px, `accentDark` ground), centred 420px form right. Phone number → WhatsApp link, 6-digit code as fallback, "shared computer" checkbox ticked by default. No passwords exist in this product. |
| **W22** | `AdminPersonNew` | full-page form over the list (`✕`) | Add a person. Eleven fields in four sections: who they are, standing, where they live, what they are interested in. Household matcher open. Two save actions: *Save and close*, *Save and add another*. |
| **W28** | `AdminRolePicker` | same route as W22, picker open | The grouped serving-role search. Department headings are labels, roles are the options, chosen roles are chips above the input. |
| **W26** | `AdminHousehold` (1440×1040) | detail route (back chevron) | One household. Address + map + pin left; occupants right, split into **Family** and **Also lives here**; then *Moved out* with where each person went. Prints as a family card. |
| **W24** | `AdminGroups` | list route | Care groups. Group list, selected group with members and its leader, and the queue of people who asked for a group and have not been placed. |
| **W27** | `AdminDepartments` | list route | Departments and serving roles. Department list, roles with interest counts, one deactivated role shown, and the people interested in the selected department. |
| **W29** | `AdminDepartmentsEmpty` | same route, empty state | No departments yet. **This is the state the product ships in** — nothing is seeded. One sentence, one action. |
| **W25** | `AdminChurch` | settings route | The church record: name, address, time zone, worship day, map, administrators (minimum two), and what the register currently holds. |

## Already drawn, and in the release (canvas page 4)

These seven predate the admin-register pass. They are in the R0-A ship list unchanged, and they are
office screens with real product copy — but read the drift note below before building two of them.

| Code | File | What it is |
|---|---|---|
| **W11** | `WebEmpty` | The first screen a church ever sees: an empty People table that teaches one concept, then gives an order to work in. Onboarding, not a placeholder. |
| **W2** | `WebPeople` | The People table. Search, filter, and the missing-phone-number complaint that becomes a queue on W21. |
| **W6** | `WebPerson` | One person, and lifecycle. Transferred and deceased are register facts: nothing is ever deleted, forward-looking surfaces drop the person, backward-looking ones keep them. |
| **W5** | `WebImport` | Import from Excel. Nothing is rejected — all rows land and the bad ones arrive flagged. Two weeks of work on its own. |
| **W12** | `WebMerge` | Two records, one person. Never lose a value to an empty one; histories add; reversible for thirty days. |
| **W10** | `WebData` | Your data, and leaving. Export is on every Tuesday, not on the way out. Addresses are left out of the default export. |
| **W13** | `WebRoles` | Who can do what — in this release, who the administrators are. Refuses a church with only one. |

### Drift note, and it matters

**W6 and W2 predate the eleven-field person and the household split.** W6 shows the old six-field
record with no second phone, no serving interests, no care-group wish; W2's columns were chosen
before those fields existed. Build W22/W26 first (they are current), then re-derive W6 and W2 from
them rather than copying the artboard.

**W17** (`WebHouseAdmin`, *A household, and who signs in*) is on canvas page 4 but **not** in the
ship list: W26 supersedes it, and its "who signs in" column describes accounts that do not exist in
this release. It is not exported.

These seven also predate the copy rule, so one or two carry a line of reasoning in the UI that the
newer screens would not. Strip it when you build.

## Phone — 390 × 844

Drawn inside real browser chrome. The chrome is not product; see the end of `components.md`.

| Code | File | What it is |
|---|---|---|
| **W19** | `AdminSignIn` | Sign in on a phone. The office is often a volunteer with no desk. |
| **W20** | `AdminLinkStuck` | The sign-in link opened inside WhatsApp's in-app browser: signed in, but nothing to save to a home screen. Three steps to fix it, once. Every administrator meets this on the day they are added. |
| **W21** | `AdminHomePhone` | The register on a phone, saved to the home screen (no address bar). Counts, add, find, and the three queues the register generates: missing phone numbers, people who asked for a care group, households with no address. |
| **W23** | `AdminPersonPhone` | Add a person, fast path: four fields — name, phone, membership, household — with the rest behind *More details*. The form filled standing in a hall is not the form filled at a desk. |

### Responsive rule

Desktop for the big jobs: the people table, import, merge, the roster grid. Phone width for the
frequent small ones: add one person, correct one number, look someone up. Both are the same routes
at two widths; nothing is phone-only or desktop-only except the import column mapping.

---

## Specification sheets — reference, not product

Do not build these. They carry the reasoning that was removed from the screens.

| Code | File | Answers |
|---|---|---|
| **S12** | `AdminScope` (1440×1020) | Why the first build is one role, not one surface. Who gets what; which nine office screens go dormant and what wakes them; what this drops; the three decisions that still cost a migration. |
| **S14** | `AdminModel` (1440×1300) | Household vs family. The two facts and what each owns, the one relation list and where the line between kin and non-kin falls, six situations that decide the model, and the tables. |
| **S15** | `AdminServing` (1440×900) | Departments, roles, and interest. Seven rules, the tables, and the line this must not cross — the catalogue and the wish ship, no schedule does. |
| **S13** | `AdminRelease` (1440×1150) | What ships: 18 routes, 8 capabilities, the build order, what is closed by this release and what stays open. |

---

## Build order

From S13, and the order matters more than the total:

1. **The church record and tenancy** — one row before any person exists. The time zone is set here
   or every timestamp is a guess.
2. **Admin auth, two administrators** — the WhatsApp template has a vendor lead time; start it in
   week one.
3. **Households, then people** — the household holds the address, so it is the first table with a
   shape.
4. **The map** — search and a draggable pin. Everything works without it, worse.
5. **Care groups, then the serving catalogue** — the catalogue ships empty (W29), so the interest
   field waits on it.
6. **Import, then merge** — two weeks together. Never ship the first without the second: import
   makes duplicates.
7. **Export** — before the second church signs, not the first.

## Not in this release

Named so nobody builds them by reflex: an offline queue, push notifications, an app shell, RSVP,
attendance, meetings, weekly content (warta), applications, serving rosters and assignments, and the
second writer of the statement store. All are designed elsewhere in the canvas and all wait for the
mobile app.
