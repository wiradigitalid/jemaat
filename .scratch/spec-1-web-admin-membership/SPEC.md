# SPEC-1 — Web Admin: Membership & Households

## Overview
Implements the core administrative foundation for the Jemaat church office back-office portal, covering member directories, detailed profiles, household grouping, spreadsheet import with duplicate detection, and membership lifecycle tracking.

## References
- PRD: `.what/_prd/church-operations/prd.md` (`CAP-1`)
- SRS: `.what/membership/SRS-membership.md`
- SDD: `.how/membership/SDD-membership.md`
- Rules: `.what/membership/02-rules/rules-membership.md` (`BR-MEM-1` to `BR-MEM-4`, `BR-1`, `BR-4`)
- HTML Prototypes:
  - `apps/web` Admin Layout Shell: `.work/design/screens-web.mjs` (Sidebar, Header, Token palette)
  - Member Registry Table: `.work/design/WebPeople.dc.html`
  - Member Profile & Detail: `.work/design/WebPerson.dc.html`
  - Member Creation Dialog: `.work/design/AdminPersonNew.dc.html`
  - Household Linking & Management: `.work/design/WebHouseAdmin.dc.html`, `.work/design/AdminHousehold.dc.html`
  - CSV Import & Deduplication: `.work/design/WebImport.dc.html`, `.work/design/WebData.dc.html`, `.work/design/WebMerge.dc.html`
  - Lifecycle, Transfer & Audit Trail: `.work/design/WebArchive.dc.html`, `.work/design/WebTransfer.dc.html`, `.work/design/WebChanges.dc.html`

## Seams & Testing Strategy
- API Seam: REST endpoints `/api/v1/people`, `/api/v1/households`, `/api/v1/imports/members` tested via Go HTTP test handlers with PostgreSQL test container.
- UI Seam: React 18 component testing via Vitest + Testing Library, asserting exact DOM fidelity with `.work/design/` HTML tokens (Sidebar tabs, typography `Newsreader`/`Inter`, badges, form inputs).
