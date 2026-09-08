---
type: srs
component: membership
status: draft
created: '2026-09-08'
satisfies:
  - FR-1
  - FR-2
  - FR-3
  - FR-4
reviewed:
  date: '2026-09-08'
  sha: 'fa39a613791991dd5d6f1ae878eab7ea8d9ef7b6'
  lenses:
    - structure
    - prose
    - edge-case-hunter
---

# SRS — Membership & Households

## Decision Summary · [G3]

Centralized membership registry and household management for church administrators.

## Why · [G3]

Provides church staff with an authoritative, single source of truth for individual member profiles, contact information, family relationships, and membership status tracking, replacing fragmented spreadsheets and preventing desynchronization.

## Actor Register · [G3]

| Actor | Who they are | What they may do |
|---|---|---|
| Church Administrator | Office staff or pastoral admin | Create, update, import, and merge member and household records |
| Church Member | Verified congregant | View personal profile and household records, submit profile corrections |

## UC Catalogue · [G3]

UC Catalogue — see `.control/registry/usecases.yaml`, rows where `component: membership`.

## Constraints · [G3]

- Must enforce uniqueness of national ID (NIK) or primary mobile number per active member profile (`NFR-1`).
- Anonymized export and strict role-based masking for unverified congregants (`NFR-1`, `AD-3`).
- CSV imports must validate household address matching before creating redundant household groups (`FR-3`).

## Non-Goals · [G3]

- Financial contributions, tithes, and tax receipt generation (handled externally or in future financial extension; not in `membership`).
- Volunteer roster scheduling (owned by `serving`).
- Small group attendance tracking (owned by `caregroups`).

## Prerequisite · [G3]

- Initial church tenant profile configured with country/region locale settings for phone and identity formatting.

## Success Signal · [G3]

At least 90% of active congregants have a verified personal record linked to a primary household within 6 months of rollout (`BG-1`).

## Assumptions, Risks, and To Be Confirmed · [G3]

### Assumptions
- Congregants living at the same physical residential address prefer to be grouped under a single household entity for mailings and family notifications.

### Risks
- Messy legacy spreadsheet data with duplicate names or shared family phone numbers may cause initial import collisions if matching rules are too strict.

### To Be Confirmed
- None.

## Gate Checklist · [G3]

- Actor list complete and distinct? Yes.
- Titles of use cases expressed as user goals? Yes.
- Critical use case ratio within threshold (<= 33%)? Yes (1 out of 5, 20%).
- Domain boundaries strictly respect `owns:`? Yes (`person`, `household`, `family_relationship`, `membership_record`).

## Design Reference · [G3]

Paired SDD: `.how/membership/SDD-membership.md`. Bound by `AD-1`, `AD-3`. Applied decisions: see `.control/generated/decisions.md`.
