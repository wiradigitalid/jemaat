---
type: rules
scope: component
component: portal
status: draft
created: '2026-09-08'
---

# Business Rules — Congregational Portal & Workflows

## Rules

| id | Rule | Binds | Source | Status |
|---|---|---|---|---|
| BR-POR-1 | Sunday service bulletins and church announcements must be pre-cached on mobile devices so they remain readable in church auditoriums without cellular connectivity. | `portal` | FR-12 | active |
| BR-POR-2 | Church code lookup must be case-insensitive, reject ambiguous characters (e.g. 0/O, 1/I), and resolve in under 500ms over standard mobile data. | `portal` | FR-13 · AD-6 | active |
| BR-POR-3 | Congregational directory queries must enforce field-level masking at the database/API layer; unmasked phone numbers and addresses are never serialized unless explicit opt-in is recorded. | `portal`, `membership` | FR-14 · AD-3 · BR-4 | active |
| BR-POR-4 | Automated reminder notifications (serving duties, meetings) must be throttled to prevent notification fatigue and must honor recipient quiet hours. | `portal` | FR-15 · BR-6 | active |
| BR-POR-5 | Guest intake submissions must undergo automated rate limiting (max 3 submissions per IP/device per hour) to prevent form spam. | `portal` | FR-16 | active |
