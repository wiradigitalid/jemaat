---
type: sdd
component: membership
status: draft
created: '2026-09-08'
realizes:
  - UC-1
  - UC-2
  - UC-3
  - UC-4
  - UC-5
binds:
  - AD-1
  - AD-2
  - AD-3
reviewed:
  date: '2026-09-08'
  sha: 'fa39a613791991dd5d6f1ae878eab7ea8d9ef7b6'
  lenses:
    - structure
    - prose
    - edge-case-hunter
---

# SDD — Membership & Households

## Decision Summary · [outline]

The `membership` component provides the core congregational identity and family registry substrate for Jemaat. It is architected as a decoupled Go domain package (`internal/membership`) exposing type-safe service interfaces to other internal packages while persisting records to PostgreSQL using SQLC-generated queries. Key trade-offs include enforcing strict individual identity (`person`) independent of dwelling linkages (`household`) to prevent data corruption during family relocations, and executing spreadsheet imports in two-phase dry-run transactions with duplicate matching.

## Structure · [outline]

| LC | type | Responsibility |
|---|---|---|
| `screen-web-people` | ui-screen | Web administrative member directory, profile creation, and standing updates |
| `screen-web-households` | ui-screen | Web household creation, family tree linking, and address management |
| `screen-web-data` | ui-screen | Web CSV batch import dropzone, column mapper, and duplicate merge workbench |
| `screen-mobile-profile` | ui-screen | Mobile self-service profile review, contact update, and privacy toggle |

Logical Component dependencies:
`screen-web-people` -> `internal/membership/handler` -> `internal/membership/service` -> `internal/membership/repository` -> PostgreSQL (`db`).

## Inherited Constraints · [guarded]

| AD | How it lands here |
|---|---|
| `AD-1` | Domain logic for persons and households resides strictly within `internal/membership/`. Other packages (such as `serving` and `caregroups`) must query member eligibility via public Go service interfaces, never by executing direct SQL JOINs against `persons` or `households`. |
| `AD-2` | Data import parsers and phone normalization utilities must use permissively licensed libraries (MIT/Apache 2.0). Code from legacy GPL systems in `.temp/` is prohibited. |
| `AD-3` | The API layer automatically applies contact masking (replacing phone and address with `***`) on all non-administrative endpoints unless the member's profile explicitly sets `directory_visible = true`. |

## Failure Behaviour · [guarded]

| Boundary | Slow | Absent | Lying | What the user sees | What is logged |
|---|---|---|---|---|---|
| `GET /api/v1/people` | Client timeout at 8s; returns cached page if available | HTTP 503 Service Unavailable | Malformed JSON or invalid pagination cursor | "Unable to load member directory. Retrying..." | `WARN: membership.get_people query timeout or connection refusal` |
| `POST /api/v1/people` | Button enters loading state with spinner; 10s timeout | HTTP 503 / network drop | Payload with duplicate phone/NIK | "Failed to save member profile. Please check if this phone is already registered." | `INFO: duplicate person registration rejected for phone/nik` |
| `POST /api/v1/households` | 8s timeout | HTTP 503 Service Unavailable | Household payload with missing Head of Household | "Household must have exactly one Head of Household." | `WARN: invalid household creation payload rejected` |
| `POST /api/v1/people/import` | Asynchronous job status polling if batch > 500 rows | HTTP 502 Bad Gateway | Corrupt CSV syntax or mismatched column headers | "Import paused: column mapping failed or invalid CSV syntax." | `ERROR: csv parsing error at row N with reason` |
| `POST /api/v1/people/merge` | 10s transaction timeout with full rollback | HTTP 500 Internal Error | Target Person ID identical to source ID | "Cannot merge a profile into itself." | `WARN: invalid self-merge attempted` |
| `screen-web-people` | Skeleton loader shimmer | Offline indicator banner | Incomplete state rendering | "Network error. Reconnect to access live member records." | Client-side console error with HTTP status |
| `screen-web-data` | Progress bar with percentage indicator | File upload fails | File exceeds 10MB limit | "File exceeds maximum upload size (10MB). Please split your spreadsheet." | Client-side file validation warning |
| `screen-mobile-profile` | Cached local profile displayed with refresh pill | "Showing offline profile" banner | Tampered local token | "Session expired. Please sign in again." | Security audit log of token validation failure |
